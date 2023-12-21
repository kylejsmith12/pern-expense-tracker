// api.js
const apiUrl = "http://localhost:5001/api/expenses";
import { chartColors } from "./chartcolors";
export const fetchData = async (selectedMonth) => {
  try {
    const response = await fetch(apiUrl, { credentials: "include" });
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("API did not return an array:", data);
      return null;
    }

    const filteredData = data.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = (expenseDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");

      return selectedMonth === "" || expenseMonth === selectedMonth;
    });

    const uniqueCategories = [
      ...new Set(filteredData.map((expense) => expense.category)),
    ];

    const categoryCounts = uniqueCategories.reduce((counts, category) => {
      const categoryCount = filteredData.filter(
        (expense) => expense.category === category
      ).length;

      if (categoryCount > 0) {
        counts[category] = categoryCount;
      }
      return counts;
    }, {});

    const totalAmounts = uniqueCategories.reduce((amounts, category) => {
      const categoryAmount = filteredData
        .filter((expense) => expense.category === category)
        .reduce((total, expense) => total + parseFloat(expense.amount), 0);

      amounts[category] = categoryAmount.toFixed(2);
      return amounts;
    }, {});

    const dailyAmounts = filteredData.reduce((dailyAmounts, expense) => {
      const date = new Date(expense.date);
      const dayOfMonth = date.getDate().toString();

      if (!dailyAmounts[dayOfMonth]) {
        dailyAmounts[dayOfMonth] = 0;
      }

      dailyAmounts[dayOfMonth] += parseFloat(expense.amount);
      return dailyAmounts;
    }, {});

    const totalSpentForMonth = filteredData.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );

    return {
      categories: uniqueCategories,
      categoryData: {
        labels: Object.keys(categoryCounts),
        datasets: [
          {
            data: Object.values(categoryCounts),
            backgroundColor: chartColors,
            hoverBackgroundColor: chartColors,
          },
        ],
      },
      totalAmountData: {
        labels: Object.keys(totalAmounts),
        datasets: [
          {
            label: "Total Expense Amount",
            data: Object.values(totalAmounts),
            backgroundColor: "rgba(75,192,192,0.6)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      },
      dailyAmountData: {
        labels: Object.keys(dailyAmounts),
        datasets: [
          {
            label: "Daily Expense Amount",
            data: Object.values(dailyAmounts),
            fill: false,
            borderColor: "#742774",
            tension: 0.1,
          },
        ],
      },
      totalSpent: totalSpentForMonth.toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default fetchData;
