const DataWrapper = ({ children }) => {
  const fetchData = async (source, timeRange, tagFilters) => {
    let response;

    switch (source) {
      case "twitter":
        response = await fetch("/.netlify/functions/fetchTwitter");
        if (!response.ok) {
          throw new Error(`Request failed with: ${response.statusText}`);
        }
        return await response.json();
      case "tumblr":
        response = await fetch("/.netlify/functions/fetchTumblr");
        if (!response.ok) {
          throw new Error(`Request failed with: ${response.statusText}`);
        }
        return await response.json();
      case "all":
        let tumblrResponse = await fetch("/.netlify/functions/fetchTumblr");
        let twitterResponse = await fetch("/.netlify/functions/fetchTwitter");
        if (!tumblrResponse.ok || !twitterResponse.ok) {
          throw new Error(
            `Request failed with: tumblr(${tumblrResponse.statusText}), twitter(${twitterResponse.statusText})`
          );
        }

        tumblrResponse = await tumblrResponse.json();
        twitterResponse = await twitterResponse.json();
        response = [...tumblrResponse, ...twitterResponse];
        return response;
      default:
        throw new Error("Invalid data source");
    }
  };

  return children(fetchData);
};

export default DataWrapper;
