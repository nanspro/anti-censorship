import React from "react";
import { TextInput, Box, Button, ResponsiveContext } from "grommet";
import * as Icons from "grommet-icons";
import styled from "styled-components";

import Container from "./components/Container";
import Navbar from "./partials/Navbar";

const StyledTextInput = styled(TextInput)`
  border: 2px solid #7d4cdb;
  border-radius: 18px;
  padding: 5px 10px 5px 45px;
`;

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Container>
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box
              direction={size === "small" ? "column" : "row"}
              gap="medium"
              justify="between"
              margin={{ vertical: "medium" }}
            >
              <Box>
                <StyledTextInput
                  icon={<Icons.Search />}
                  focusIndicator={false}
                  placeholder="Search for tag"
                  // value={value}
                  // onChange={(event) => setValue(event.target.value)}
                />
              </Box>
              <Box gap="small" direction="row" justify="around">
                <Button
                  icon={<Icons.Aggregate />}
                  label="All Posts"
                  onClick={() => {}}
                />
                <Button
                  icon={<Icons.Twitter />}
                  label="Twitter"
                  onClick={() => {}}
                />
                <Button
                  icon={<Icons.Tumblr />}
                  label="Tumblr"
                  onClick={() => {}}
                />
              </Box>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Container>
      <Container>Hello</Container>
    </>
  );
};

export default Dashboard;
