import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Box, Typography, Paper, Grid } from "@mui/material";

const categories = [
  "Utilities",
  "Insurance",
  "Cellphone",
  "Medical",
  "Amazon",
  "Subscriptions",
  "Miscellaneous",
  "Internet",
  "Cable",
  "Food",
  "Debt",
  "Health Insurance",
  "Restaurants",
  "Clothing",
  "Donations",
  "Housing",
  "Transportation",
  "Travel",
  "Homeowners Insurance",
  "Entertainment",
  "Annual Fee",
  "Gym",
  "Not Listed",
];

const ViewCategories = () => {
  const [categoryData, setCategoryData] = useState({});
  const [totalAmountData, setTotalAmountData] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/expenses");
      const data = await response.json();

      console.log("API data:", data);

      if (!Array.isArray(data)) {
        console.error("API did not return an array:", data);
        return;
      }

      const categoryCounts = categories.reduce((counts, category) => {
        const categoryCount = data.filter(
          (expense) => expense.category === category
        ).length;

        if (categoryCount > 0) {
          counts[category] = categoryCount;
        }
        return counts;
      }, {});

      setCategoryData({
        labels: Object.keys(categoryCounts),
        datasets: [
          {
            data: Object.values(categoryCounts),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              // ... (additional colors)
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              // ... (additional colors)
            ],
          },
        ],
      });

      const totalAmounts = categories.reduce((amounts, category) => {
        const categoryAmount = data
          .filter((expense) => expense.category === category)
          .reduce((total, expense) => total + parseFloat(expense.amount), 0);

        amounts[category] = categoryAmount.toFixed(2);
        return amounts;
      }, {});

      setTotalAmountData({
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
      });

      const totalSpentForMonth = data.reduce(
        (total, expense) => total + parseFloat(expense.amount),
        0
      );
      setTotalSpent(totalSpentForMonth.toFixed(2));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper>
          <Box
            p={2}
            width={400}
            height={400}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6">Expense Distribution</Typography>
            {Object.keys(categoryData).length > 0 ? (
              <Pie data={categoryData} />
            ) : (
              <Typography>
                No data available for the selected categories.
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper>
          <Box
            p={2}
            width={400}
            height={400}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6">Total Expense Amounts</Typography>
            {Object.keys(totalAmountData).length > 0 ? (
              <Bar data={totalAmountData} />
            ) : null}
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Paper>
          <Box
            p={2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6">Total Spent for the Month:</Typography>
            <Typography variant="h3" style={{ textAlign: "center" }}>
              ${totalSpent}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ViewCategories;
