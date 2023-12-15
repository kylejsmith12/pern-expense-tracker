import { Box, Typography, Paper, Grid, Select, MenuItem } from "@mui/material";

const TotalSpentPaper = ({ totalSpent }) => (
  <Grid item xs={12} sx={{ textAlign: "center" }}>
    <Paper>
      <Box
        p={2}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h6">Total Spent for the Month:</Typography>
        <Typography variant="h3">${totalSpent}</Typography>
      </Box>
    </Paper>
  </Grid>
);

export default TotalSpentPaper;
