import React from "react";
import { TextInput, Box, Button, ResponsiveContext } from "grommet";
import * as Icons from "grommet-icons";
import styled from "styled-components";

import Container from "../components/Container";

const StyledTextInput = styled(TextInput)`
  border: 2px solid #7d4cdb;
  border-radius: 18px;
  padding: 5px 10px 5px 45px;
`;

const Searchbar = ({ activeSource, onSearch, onSourceChange }) => {
  // Boolean onSearch(query)
  // Boolean onSourceChange(source) -> source in ["all", "twitter", "tumlr"]

  return (
    <Container>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box
            direction={size === "small" ? "column" : "row"}
            gap="small"
            justify="between"
            margin={{ vertical: "medium" }}
          >
            <Box
              gap="small"
              direction={size === "small" ? "column" : "row"}
              justify="around"
            >
              <Button
                disabled
                icon={<Icons.Aggregate />}
                label="All Posts"
                onClick={() => {}}
                primary={activeSource === "all"}
              />
              <Button
                icon={<Icons.Twitter />}
                label="Twitter"
                onClick={() => {}}
                primary={activeSource === "twitter"}
                color="#08a0e9"
              />
              {/* <Button
                disabled
                icon={<Icons.Tumblr />}
                label="Tumblr"
                onClick={() => {}}
                primary={activeSource === "tumblr"}
              /> */}
            </Box>
            <Box>
              <StyledTextInput
                disabled
                icon={<Icons.Search />}
                focusIndicator={false}
                placeholder="Search tags"
                // value={value}
                // onChange={(event) => setValue(event.target.value)}
              />
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Container>
  );
};

Searchbar.defaultProps = {
  activeSource: "twitter",
};

export default Searchbar;
