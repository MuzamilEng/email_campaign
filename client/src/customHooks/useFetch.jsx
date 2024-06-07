import React, { useEffect } from "react";
import Papa from "papaparse";

const useFetch = () => {
  const sanitizeColumns = (data) => {
    return data.map((item) => {
      const sanitizedItem = {};
      Object.keys(item).forEach((key) => {
        const sanitizedKey = key.toLowerCase().replace(/(\s|-)+/g, "_");
        sanitizedItem[sanitizedKey] = item[key];
      });
      return sanitizedItem;
    });
  };

  const fetchCsvData = async (filePath, callback) => {
    const response = await fetch(filePath);
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csvString = decoder.decode(result.value);
    const { data } = Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
    });
    const sanitizedData = sanitizeColumns(data);
    callback(sanitizedData);
  };

  return { fetchCsvData };
};

export default useFetch;


// import { useState, useEffect } from 'react';

//  const useFetch = () => {
//   const fetchCsvData = async (filePath, callback) => {
//     try {
//       const response = await fetch(filePath);
//       if (!response.ok) throw new Error('Network response was not ok');
//       const data = await response.text();
//       const parsedData = data.split('\n').map(row => row.split(',')); // Simple CSV parsing
//       callback(parsedData);
//     } catch (error) {
//       console.error('Error fetching CSV data:', error);
//     }
//   };

//   return { fetchCsvData };
// };


// export default useFetch;