import React from "react";
import { Box, ResponsiveContext } from "grommet";

const LARGE_CONTAINER_WIDTH = "1200px";
const MEDIUM_CONTAINER_WIDTH = "800px";

const Container = ({ children }) => (
  <ResponsiveContext.Consumer>
    {(size) =>
      ["medium", "large"].indexOf(size) >= 0 ? (
        <Box align="center" width="100%">
          <Box
            width={
              size === "large" ? LARGE_CONTAINER_WIDTH : MEDIUM_CONTAINER_WIDTH
            }
          >
            {children}
          </Box>
        </Box>
      ) : (
        <Box margin={{ horizontal: "small" }}>{children}</Box>
      )
    }
  </ResponsiveContext.Consumer>
);

export default Container;
