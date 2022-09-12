import { Box, Toolbar } from "@mui/material";
import React from "react";
import AppBar from "./components/AppBar";
import AppDrawer from "./components/Drawer/Drawer";

import { useSession } from "next-auth/react";
import WithRequiredData from "./hocs/withRequiredData";
import Loader from "./components/Loader";

interface Props {
  children: React.ReactNode;
}

const App = ({ children }: Props) => {
  const session = useSession({ required: true });

  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  if (session.status === "loading") return <Loader />;

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

export default WithRequiredData(App);
