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

const Searchbar = ({ activeSource, setActiveSource }) => {
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
                icon={<Icons.Aggregate />}
                label="All Posts"
                onClick={() => {
                  setActiveSource("all");
                }}
                primary={activeSource === "all"}
              />
              <Button
                icon={
                  <Icons.Twitter
                    color={activeSource !== "twitter" ? "#08a0e9" : null}
                  />
                }
                label="Twitter"
                onClick={() => {
                  setActiveSource("twitter");
                }}
                primary={activeSource === "twitter"}
                color="#08a0e9"
              />
              <Button
                icon={
                  <Icons.Tumblr
                    color={activeSource !== "tumblr" ? "#34526F" : null}
                  />
                }
                label="Tumblr"
                onClick={() => {
                  setActiveSource("tumblr");
                }}
                primary={activeSource === "tumblr"}
                color="#34526F"
              />
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
