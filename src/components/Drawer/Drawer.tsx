import React from "react";
import Drawer from "@mui/material/Drawer";
import { css, Toolbar } from "@mui/material";
import NestedList from "../AppBar/NestedList";
import Box from "@mui/material/Box";

const drawerWidth = 200;

interface Props {
  onDrawerToggle: () => void;
  open: boolean;
}

export default function AppDrawer({ onDrawerToggle, open }: Props) {
  const drawer = (
    <Box onClick={onDrawerToggle} sx={{ textAlign: "center" }}>
      <NestedList />
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        css={css`
          width: ${drawerWidth}px;
        `}
        PaperProps={{
          sx: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        sx={{
          display: { xs: "block", lg: "none" },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>
      <Drawer
        css={css`
          width: ${drawerWidth}px;
        `}
        variant="permanent"
        PaperProps={{
          sx: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        sx={{
          display: { xs: "none", lg: "block" },
        }}
        open
      >
        <Toolbar />
        {drawer}
      </Drawer>
    </>
  );
}
