import React, { useEffect, useState } from "react";

import Navbar from "./partials/Navbar";
import Searchbar from "./partials/Searchbar";
import Posts from "./partials/Posts";

const Dashboard = ({ fetchData }) => {
  const [activeSource, setActiveSource] = useState("all");
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const _data = await fetchData(activeSource);
        let data = [];
        for (let post of _data) {
          try {
            let value = await JSON.parse(post.value);
            if (value.source === "tumblr")
              value.timestamp = value.timestamp * 1000;
            data.push({ value, key: post.key });
          } catch (e) {}
        }
        data.sort(function (a, b) {
          return b.value.timestamp - a.value.timestamp;
        });
        setData(data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [activeSource]);

  return (
    <>
      <Navbar />
      <Searchbar
        activeSource={activeSource}
        setActiveSource={setActiveSource}
      />
      <Posts posts={data} />
    </>
  );
};

export default Dashboard;
