// import React from "react";
// import { PerformanceData } from "../type";  // Importing common type
// // Props ka type define kiya
// // interface PerformanceData {
// //   _id: string;
// //   year: number;
// //   section: string;
// //   title: string;
// // }

// interface PerformanceTableProps {
//   data: PerformanceData[];
// }

// const PerformanceTable: React.FC<PerformanceTableProps> = ({ data }) => {
//   return (
//     <table className="min-w-full bg-white border border-gray-200">
//       <thead>
//         <tr>
//           <th className="py-2 border">Year</th>
//           <th className="py-2 border">Section</th>
//           <th className="py-2 border">Title</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item) => (
//           <tr key={item._id}> {/* Index ke badle `_id` use kiya */}
//             <td className="py-2 border">{item.year}</td>
//             <td className="py-2 border">{item.section}</td>
//             <td className="py-2 border">{item.title}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default PerformanceTable;
