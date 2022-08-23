import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
// When using TypeScript 4.x and above
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-data-grid-premium/themeAugmentation";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
        },
      },
    },
  },
});

export default theme;
