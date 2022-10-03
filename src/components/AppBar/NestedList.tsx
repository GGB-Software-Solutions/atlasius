import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import NextLink from "next/link";

type Route = {
  name: string;
  href?: string;
  items?: Route[];
};

const routes: Route[] = [
  {
    name: "Склад",
    items: [
      { name: "Наличности", href: "/products" },
      { name: "Заприхождаване", href: "/delivery" },
    ],
  },
  { name: "Компании", href: "/companies" },
  { name: "Складове", href: "/warehouses" },
  { name: "Задачи", href: "/tasks" },
  { name: "Експедиции", href: "/expeditions" },
  { name: "Поръчки", href: "/expeditions" },
];

interface RenderListItem {
  route: Route;
  open: boolean;
  onClick: (id, e) => void;
  isNestedItem?: boolean;
}

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
      {routes.map((route) =>
        renderListItem({
          route,
          open: open[route.name],
          onClick: handleClick,
        })
      )}
    </List>
  );
}
