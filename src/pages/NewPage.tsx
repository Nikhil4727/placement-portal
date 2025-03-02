import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";

type Student = {
  "Reg No": string;
  Year: number;
  section: string;
  [key: string]: any; // Allows dynamic assessment fields
};

const PlacementPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState("2nd Year");
  const [students, setStudents] = useState<Student[]>([]);
  const [columns, setColumns] = useState<string[]>(["Reg No", "Year", "Section"]);
  const [loading, setLoading] = useState(false);

  // Fetch data when activeTab changes
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/students/${activeTab}?timestamp=${new Date().getTime()}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.students) && data.students.length > 0) {
          const allColumns = new Set<string>(["Reg No", "Year", "section"]);
          const processedStudents = data.students.map((student: Student) => {
            const updatedStudent = { ...student };
  
            // Identify assessment categories dynamically
            const assessmentCategories = new Set<string>();
  
            Object.keys(student).forEach((key) => {
              allColumns.add(key);
  
              const match = key.match(/(.*?) Assessment \d+/);
              if (match) {
                assessmentCategories.add(match[1]); // Extracts "QALR", "AWS", etc.
              }
            });
  
            // Compute total & average dynamically
            assessmentCategories.forEach((category) => {
              const assessments = Object.keys(student)
                .filter((key) => key.startsWith(category + " Assessment"))
                .map((key) => student[key] ?? 0);
  
              const total = assessments.reduce((sum, val) => sum + val, 0);
              const average = assessments.length > 0 ? (total / assessments.length).toFixed(2) : "0.00";
  
              updatedStudent[`${category} Total`] = total;
              updatedStudent[`${category} Average`] = average;
  
              allColumns.add(`${category} Total`);
              allColumns.add(`${category} Average`);
            });
  
            return updatedStudent;
          });
  
          setColumns([...allColumns]);
          setStudents(processedStudents);
        } else {
          setStudents([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, [activeTab]);
  

  // Function to download CSV
  const handleDownloadCSV = () => {
    if (students.length === 0) return;

    let csvContent = columns.join(",") + "\n";

    students.forEach((student) => {
      const row = columns.map((col) => student[col] ?? "-").join(",");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${activeTab.replace(" ", "_")}_Students.csv`);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {["2nd Year", "3rd Year", "4th Year"].map((year) => (
          <button
            key={year}
            className={`px-4 py-2 rounded-lg text-white ${activeTab === year ? "bg-blue-600" : "bg-gray-400"}`}
            onClick={() => setActiveTab(year)}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500">Loading data...</p>}

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow-lg overflow-auto">
        {students.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th key={col} className="border p-2">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="text-center">
                  {columns.map((col) => (
                    <td key={col} className="border p-2">{student[col] ?? "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p className="text-center text-gray-500">No data available</p>
        )}
      </div>

      {/* Download Button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-all"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default PlacementPortal;
