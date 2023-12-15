import { Box, Typography, Paper, Grid, Select, MenuItem } from "@mui/material";

const MonthSelector = ({ selectedMonth, handleMonthChange }) => (
  <Grid item xs={12}>
    <Box display="flex" justifyContent="flex-end" p={2} alignItems="center">
      <Typography variant="h6" sx={{ marginRight: 2 }}>
        Select Month:
      </Typography>
      <Select
        value={selectedMonth}
        onChange={handleMonthChange}
        label="Select Month"
      >
        <MenuItem value="" disabled>
          Select Month
        </MenuItem>
        {[...Array(12)].map((_, index) => (
          <MenuItem key={index} value={(index + 1).toString().padStart(2, "0")}>
            {new Date(2000, index, 1).toLocaleString("en-US", {
              month: "long",
            })}
          </MenuItem>
        ))}
      </Select>
    </Box>
  </Grid>
);

export default MonthSelector;
