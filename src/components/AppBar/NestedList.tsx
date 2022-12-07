import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import NextLink from "next/link";
import { Role } from "../../types";
import useStore from "../../store/globalStore";

type Route = {
  name: string;
  href?: string;
  items?: Route[];
  role?: Role[];
};

const routes: Route[] = [
  {
    name: "Склад",
    items: [
      { name: "Наличности", href: "/products", role: [Role.User] },
      { name: "Заприхождаване", href: "/delivery" },
    ],
    role: [Role.User],
  },
  { name: "Компании", href: "/companies" },
  { name: "Складове", href: "/warehouses" },
  { name: "Задачи", href: "/tasks", role: [Role.User] },
  { name: "Експедиции", href: "/expeditions", role: [Role.User] },
  { name: "Приключени поръчки", href: "/orders", role: [Role.User] },
];

interface RenderListItem {
  route: Route;
  open: boolean;
  onClick: (id, e) => void;
  isNestedItem?: boolean;
}

const filterProtectedRoutes = (routes: Route[], userRole: Role) => {
  return routes.filter((route) => {
    const isRouteAuthorized =
      userRole === Role.Admin || route.role?.includes(userRole);

    if (isRouteAuthorized && route.items) {
      route.items = filterProtectedRoutes(route.items, userRole);
    }

    return isRouteAuthorized;
  });
};

const renderListItem = ({
  route,
  open,
  onClick,
  isNestedItem = false,
}: RenderListItem) => {
  if (!route.items)
    return (
      <NextLink href={route.href as string} passHref key={route.name}>
        <ListItemButton sx={{ pl: isNestedItem ? 4 : 2 }}>
          <ListItemText primary={route.name} />
        </ListItemButton>
      </NextLink>
    );
  const handleClick = (e) => onClick(route.name, e);

  return (
    <React.Fragment key={route.name}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={route.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {route.items.map((route) =>
            renderListItem({ route, open, onClick, isNestedItem: true })
          )}
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export default function NestedList() {
  const user = useStore((state) => state.user);
  const userRole = user?.role;
  const [open, setOpen] = React.useState<{ [key: string]: boolean }>({});

  const handleClick = (id: string, e) => {
    e.stopPropagation();
    setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {filterProtectedRoutes(routes, userRole as Role).map((route) =>
        renderListItem({
          route,
          open: open[route.name],
          onClick: handleClick,
        })
      )}
    </List>
  );
}
