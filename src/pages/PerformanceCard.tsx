import React, { useState, useEffect, useRef } from "react";
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

  const [files, setFiles] = useState<any[]>([]); // State to store uploaded files
  const [showFiles, setShowFiles] = useState(false); // State to toggle file table visibility
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch uploaded files
  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched files from backend:", res.data); // Log the fetched files
      setFiles(res.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  useEffect(() => {
    fetchFiles(); 
  }, []);

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("year", selectedOptions.year!);
      formData.append("section", selectedOptions.section!);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("File uploaded successfully:", res.data); // Log the upload response
        alert("File uploaded and stored in MongoDB successfully!");

        // Refresh the file list
        await fetchFiles();

        // Clear selected options and file input
        setSelectedOptions({ year: null, section: null });
        setShowYearDropdown(false);
        event.target.value = ""; // Clear the file input
      } catch (error) {
        console.error("File upload failed:", error);
        alert("Failed to upload file.");
      }
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (filename: string) => {
    try {
      const token = localStorage.getItem("token");
      const confirmDelete = window.confirm("Are you sure you want to delete this file?");
      
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/api/file/${filename}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("File deleted successfully!");
        await fetchFiles(); // Refresh the file list
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file.");
    }
  };

  // Toggle file table visibility
  const toggleFileTable = () => {
    setShowFiles(!showFiles);
    setShowYearDropdown(false); // Hide the dropdown when "View Files" is clicked
  };

  // Handle "Add Data" button click
  const handleAddDataClick = () => {
    setShowYearDropdown(!showYearDropdown);
    setShowFiles(false); // Hide the file table
  };

  // Handle other button clicks (Update, Review)
  const handleOtherButtonClick = () => {
    setShowYearDropdown(false);
    setShowFiles(false); // Hide the file table
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>

      {/* {loading && <p>Loading performance data...</p>}
      {error && <p className="text-red-500">{error}</p>} */}

      {/* 🔹 Action Buttons */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleAddDataClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Data
        </button>
        <button
          onClick={handleOtherButtonClick}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Update Data
        </button>
        <button
          onClick={handleOtherButtonClick}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Review Data
        </button>
        <button
          onClick={toggleFileTable}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          View Files
        </button>
      </div>

      {/* 🔹 Year Dropdown */}
      {showYearDropdown && (
        <div className="mt-4">
          <label className="block text-gray-700">Select Year:</label>
          <select
            onChange={(e) => setSelectedOptions({ ...selectedOptions, year: e.target.value, section: null })}
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
            onChange={(e) => setSelectedOptions({ ...selectedOptions, section: e.target.value })}
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
          <button
            onClick={() => fileInputRef.current?.click()}
            className="border border-gray-300 px-4 py-2 rounded-md flex items-center space-x-2"
          >
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

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* 🔹 Display Uploaded Files in a Table */}
      {showFiles && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
          {files.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Filename</th>
                  <th className="border border-gray-300 p-2">Year</th>
                  <th className="border border-gray-300 p-2">Section</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{file.filename}</td>
                    <td className="border border-gray-300 p-2">{file.year}</td>
                    <td className="border border-gray-300 p-2">{file.section}</td>
                    <td className="border border-gray-300 p-2">
                      <a
                        href={`http://localhost:5000/api/file/${file.filename}`}
                        download
                        className="text-blue-500 hover:underline"
                      >
                        Download
                      </a>
                      {" | "}
                      <a 
                        href={`http://localhost:5000/view/${file.filename}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-500 hover:underline"
                      >
                        View
                      </a>
                      {" | "}
                      <button
                        onClick={() => handleDeleteFile(file.filename)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No files uploaded.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceCard;