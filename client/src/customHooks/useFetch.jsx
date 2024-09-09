import Papa from "papaparse";

// Custom Hook to fetch and parse CSV data
const useFetch = () => {
  // Function to sanitize column names
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

  // Function to fetch and parse CSV data
  const fetchCsvData = async (filePath, callback) => {
    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const csvString = await response.text(); // Fetch CSV content as text
      const { data } = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
      });

      const sanitizedData = sanitizeColumns(data);
      callback(sanitizedData); // Pass sanitized data to callback
    } catch (error) {
      console.error("Error fetching or parsing CSV data:", error);
    }
  };

  return { fetchCsvData };
};

export default useFetch;
