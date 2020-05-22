import React from "react";
import { Grommet } from "grommet";

import Dashboard from "./Dashboard";
import DataWrapper from "./components/DataWrapper";

function App() {
  return (
    <Grommet>
      <DataWrapper>
        {(fetchData) => <Dashboard fetchData={fetchData} />}
      </DataWrapper>
    </Grommet>
  );
}

export default App;
