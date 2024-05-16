import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalStateProvider";

const Index = () => {
  const { csvViewData } = useGlobalContext();
  const [columns, setColumns] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Extract column names
    if (csvViewData.length > 0) {
      setColumns(Object.keys(csvViewData[0]));
      setRecords(csvViewData);
    }
  }, [csvViewData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">CSV Data Table</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left font-semibold border border-gray-300"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="px-6 py-4 whitespace-no-wrap border border-gray-300"
                  >
                    {record[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
