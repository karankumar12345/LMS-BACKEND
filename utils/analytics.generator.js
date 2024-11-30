const mongoose = require("mongoose");

async function generateLast12MonthData(model) {
  // Define the array to store month data
  const last12Months = [];
  const currentDate = new Date();

  // Set the current date to the 1st of the current month
  currentDate.setDate(1);

  // Loop through the last 12 months
  for (let i = 11; i >= 0; i--) {
    // Set the start and end dates for the month
    const startMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const endMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      0
    );

    // Format the month and year (e.g., "October 2023")
    const monthYear = endMonth.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Count the number of documents created within this month
    const count = await model.countDocuments({
      createdAt: {
        $gte: startMonth,
        $lte: endMonth,
      },
    });

    // Push the month and count data into the array
    last12Months.push({ month: monthYear, count });
  }

  // Return the last 12 months of data
  return { last12Months };
}

module.exports = generateLast12MonthData;
