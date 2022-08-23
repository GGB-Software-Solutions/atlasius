import { Box, Toolbar } from "@mui/material";
import React from "react";
import AppBar from "./components/AppBar";
import AppDrawer from "./components/Drawer/Drawer";

interface Props {
  children: React.ReactNode;
}

const App = ({ children }: Props) => {
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

export default App;
