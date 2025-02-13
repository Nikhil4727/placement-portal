// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import PerformanceTable from "../pages/PerformanceTable";
// import PerformanceChart from "../pages/PerformanceChart";

// // Performance Data ka Type define kiya
// interface PerformanceData {
//   _id: string;
//   year: number;
//   section: string;
//   title: string;
//   topics: string[];
// }

// const PerformanceCard: React.FC = () => {
//   const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

//   useEffect(() => {
//     axios.get<PerformanceData[]>("/api/performances").then((res) => {
//       setPerformanceData(res.data);
//     });
//   }, []);

//   return (
//     <div className="bg-white shadow-md p-6 rounded-xl">
//       <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
//       <PerformanceTable data={performanceData} />
//       <PerformanceChart data={performanceData} />
//     </div>
//   );
// };

// export default PerformanceCard;






import React, { useState, useEffect } from "react";
import axios from "axios";
import { PerformanceData } from "../type";

const PerformanceCard = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    year: null as string | null,
    section: null as string | null,
  });

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<PerformanceData[]>("/api/performances", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerformanceData(res.data);
      } catch (err) {
        setError("Failed to fetch performance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  // 🔹 Show Year Dropdown
  const handleAddData = () => {
    setShowYearDropdown(true);
  };

  // 🔹 Select Year
  const handleYearSelect = (year: string) => {
    setSelectedOptions({ ...selectedOptions, year, section: null });
  };

  // 🔹 Select Section
  const handleSectionSelect = (section: string) => {
    setSelectedOptions({ ...selectedOptions, section });
  };

  // 🔹 Final Confirmation
  const handleConfirmSelection = () => {
    console.log("Final Selection:", selectedOptions);
    alert(`Year: ${selectedOptions.year}, Section: ${selectedOptions.section} selected!`);
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>

      {loading && <p>Loading performance data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && performanceData.length === 0 && (
        <p>No performance records found.</p>
      )}

      {!loading && !error && performanceData.length > 0 && (
        <>
          {/* <PerformanceTable data={performanceData} /> */}
          {/* <PerformanceChart data={performanceData} /> */}
        </>
      )}

      {/* 🔹 Action Buttons */}
      <div className="mt-4 flex space-x-4">
        <button onClick={handleAddData} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Add Data
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">Update Data</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">Delete Data</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-md">Review Data</button>
      </div>

      {/* 🔹 Year Dropdown */}
      {showYearDropdown && (
        <div className="mt-4">
          <label className="block text-gray-700">Select Year:</label>
          <select 
            onChange={(e) => handleYearSelect(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Choose Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
          </select>
        </div>
      )}

      {/* 🔹 Section Dropdown (A to I) */}
      {selectedOptions.year && (
        <div className="mt-4">
          <label className="block text-gray-700">Select Section:</label>
          <select 
            onChange={(e) => handleSectionSelect(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Choose Section</option>
            {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
      )}

      {/* 🔹 Add File Button (Show Only When Year & Section are Selected) */}
      {selectedOptions.year && selectedOptions.section && (
        <div className="mt-4">
          <button className="border border-gray-300 px-4 py-2 rounded-md flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l6 6M10 18l10-10M14 6h6m0 0V6m0 6v6" />
            </svg>
            <span className="text-blue-500">Add file</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PerformanceCard;
