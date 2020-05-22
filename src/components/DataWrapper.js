const DataWrapper = ({ children }) => {
  const fetchData = async (source, timeRange, tagFilters) => {
    switch (source) {
      case "twitter":
        const response = await fetch("/.netlify/functions/fetchTwitter");
        if (!response.ok) {
          throw new Error(`Request failed with: ${response.statusText}`);
        }
        return response.json();
      case "tubmlr":
        throw new Error("Data source not implemented");
      default:
        throw new Error("Invalid data source");
    }
  };

  return children(fetchData);
};

export default DataWrapper;
