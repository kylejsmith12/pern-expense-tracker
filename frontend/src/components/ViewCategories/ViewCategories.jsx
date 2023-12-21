// ViewCategories.js
import React, { useState, useEffect } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Box, Grid } from "@mui/material";
import MonthSelector from "./MonthSelector/MonthSelector";
import ChartPaper from "./ChartPaper/ChartPaper";
import TotalSpentPaper from "./TotalSpentPaper/TotalSpentPaper";
import { chartColors } from "./chartcolors";
import { fetchData } from "./api";

const ViewCategories = () => {
  const [categoryData, setCategoryData] = useState({});
  const [totalAmountData, setTotalAmountData] = useState({});
  const [dailyAmountData, setDailyAmountData] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const fetchDataAndUpdateState = async () => {
    const data = await fetchData(selectedMonth);
    if (data) {
      setCategories(data.categories);
      setCategoryData(data.categoryData);
      setTotalAmountData(data.totalAmountData);
      setDailyAmountData(data.dailyAmountData);
      setTotalSpent(data.totalSpent);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const totalDataSum = categoryData.datasets?.[0].data.reduce(
    (sum, value) => sum + value,
    0
  );
  const categoryPercentageData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.datasets?.[0].data.map(
          (value) => (value / totalDataSum) * 100
        ),
        backgroundColor: categoryData.datasets?.[0].backgroundColor,
        hoverBackgroundColor: categoryData.datasets?.[0].hoverBackgroundColor,
      },
    ],
  };

  useEffect(() => {
    fetchDataAndUpdateState();
  }, [selectedMonth]);
  console.log(categoryData);
  return (
    <Grid container spacing={2}>
      <MonthSelector
        selectedMonth={selectedMonth}
        handleMonthChange={handleMonthChange}
      />
      <ChartPaper
        title="Expense Distribution"
        chartData={categoryPercentageData}
        ChartComponent={Pie}
        colors={chartColors}
      />
      <ChartPaper
        title="Total Expense Amounts"
        chartData={totalAmountData}
        ChartComponent={Bar}
        colors={chartColors}
      />
      <ChartPaper
        title="Daily Expense Amounts"
        chartData={dailyAmountData}
        ChartComponent={Line}
        colors={chartColors}
      />
      <TotalSpentPaper totalSpent={totalSpent} />
    </Grid>
  );
};

export default ViewCategories;
