// In your ViewExpense.js or relevant React component

import React, { useState, useEffect } from "react";

const ViewExpense = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    fetch("/api/expenses")
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div>
      <h2>Expense Page</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description}: ${expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewExpense;
