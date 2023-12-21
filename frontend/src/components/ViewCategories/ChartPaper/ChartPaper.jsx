import { Box, Typography, Paper, Grid, Select, MenuItem } from "@mui/material";

const ChartPaper = ({ title, chartData, ChartComponent }) => {
  console.log(Object.keys(chartData));
  return (
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
          <Typography variant="h6">{title}</Typography>
          {Object.keys(chartData).length > 0 &&
            title === "Expense Distribution" && (
              <ChartComponent
                key={title}
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.parsed || 0;
                          return `${label}: ${value.toFixed(2)}%`;
                        },
                      },
                    },
                  },
                }}
              />
            )}
          {Object.keys(chartData).length > 0 &&
            title !== "Expense Distribution" && (
              <ChartComponent data={chartData} />
            )}
        </Box>
      </Paper>
    </Grid>
  );
};

export default ChartPaper;
