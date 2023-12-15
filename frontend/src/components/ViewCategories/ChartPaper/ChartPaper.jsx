import { Box, Typography, Paper, Grid, Select, MenuItem } from "@mui/material";

const ChartPaper = ({ title, chartData, ChartComponent }) => (
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
        {Object.keys(chartData).length > 0 ? (
          <ChartComponent data={chartData} />
        ) : (
          <Typography>No data available for {title}.</Typography>
        )}
      </Box>
    </Paper>
  </Grid>
);

export default ChartPaper;
