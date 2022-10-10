import { Box, Toolbar } from "@mui/material";
import React from "react";
import AppBar from "./components/AppBar";
import AppDrawer from "./components/Drawer/Drawer";

import WithRequiredData from "./hocs/withRequiredData";
import withNotifications from "./hocs/withNotifications";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
}

const App = ({ children }: Props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar onDrawerToggle={handleDrawerToggle} />
      <AppDrawer onDrawerToggle={handleDrawerToggle} open={open} />
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column" }}
        component="main"
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default WithRequiredData(withNotifications(App));
