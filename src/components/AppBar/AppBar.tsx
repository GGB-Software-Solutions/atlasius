import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import useStore from "../../store/globalStore";
import { alpha, Button } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import { Company } from "../../pages/Companies/types";
import { setJwtToken } from "../../utils/jwt";
import { useRouter } from "next/router";

interface Props {
  onDrawerToggle: () => void;
}

function CompanySelect() {
  const [languageMenu, setLanguageMenu] = React.useState(null);
  const handleLanguageIconClick = (event) => {
    setLanguageMenu(event.currentTarget);
  };
  const handleLanguageMenuClose = (event) => {
    setLanguageMenu(null);
  };

  const selectedCompany = useStore((state) => state.selectedCompany);
  const setSelectedCompany = useStore((state) => state.setSelectedCompany);
  const companies = useStore((state) => state.companies);

  const handleChange = (company: Company) => () => {
    setSelectedCompany(company);
    setLanguageMenu(null);
  };

  if (!companies || companies.length === 0) return null;

  return (
    <>
      <Menu
        id="language-menu"
        anchorEl={languageMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(languageMenu)}
        onClose={handleLanguageMenuClose}
        sx={{ width: 250 }}
      >
        {/* <MenuItem
          key={"Всички"}
          selected={selectedCompany === null}
          onClick={handleChange(null)}
        >
          {"Всички"}
        </MenuItem> */}
        {companies.map((company) => (
          <MenuItem
            key={company.name}
            selected={selectedCompany?.name === company.name}
            onClick={handleChange(company)}
          >
            {company.name}
          </MenuItem>
        ))}
      </Menu>
      <Button
        sx={{ ml: 3, width: 250 }}
        color="inherit"
        onClick={handleLanguageIconClick}
      >
        <BusinessIcon />
        <span style={{ margin: 4 }}>
          {selectedCompany?.name || "Изберия компания"}
        </span>
        <ExpandMore fontSize="small" />
      </Button>
    </>
  );
}

export default function DrawerAppBar({ onDrawerToggle }: Props) {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setJwtToken("");
    window.localStorage.setItem("logout", Date.now().toString());
    router.push("/auth/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            GGB
          </Typography>
          <CompanySelect />
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <div>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ mr: 1 }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Box>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Излез</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
