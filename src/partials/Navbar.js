import React from "react";
import { Header, Button, Text, Box } from "grommet";
import * as Icons from "grommet-icons";

const Navbar = () => {
  return (
    <Header background="brand">
      <Box direction="row" align="center" gap="small">
        <Button icon={<Icons.Aggregate />} href="/" hoverIndicator />
        <Text>Bluzelle Anti Censorship</Text>
      </Box>
      <Button
        icon={<Icons.Github />}
        href="https://github.com/nanspro/anti-censorship"
        hoverIndicator
      />
    </Header>
  );
};

export default Navbar;
