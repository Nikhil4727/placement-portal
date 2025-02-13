// import React from "react";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { PerformanceData } from "../type";  // Importing common type

// // Chart.js ko register karna zaroori hai
// ChartJS.register(ArcElement, Tooltip, Legend);

// // Props ka type define kiya
// // interface PerformanceData {
// //   _id: string;
// //   year: number;
// //   section: string;  // Ensure section is a number
// //   title: string;
// //   topics: string[];
// // }

// interface PerformanceChartProps {
//   data: PerformanceData[];
// }

// const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
//   if (!Array.isArray(data) || data.length === 0) {
//     return <p>No data available</p>;
//   }
//   const chartData = {
//     labels: data.map((item) => item.title),
//     datasets: [
//       {
//         label: "Performance",
//         data: data.map((item) => item.section), // Section ko number me convert kiya
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
//       },
//     ],
//   };

//   return <Pie data={chartData} />;
// };

// export default PerformanceChart;
