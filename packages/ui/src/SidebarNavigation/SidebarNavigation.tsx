import * as React from "react";
import Colors from "../Theme/colors";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  DrawerProps as MuiDrawerProps,
} from "@mui/material";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

interface Items {
  label: string;
  icon: any;
  active: boolean;
  href: string;
}

interface DrawerProps extends MuiDrawerProps {
  items: Items[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onNavClick: (href: string) => void;
}

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SidebarNavigation = ({ items, open, setOpen, onNavClick, ...props }: DrawerProps) => {
  const theme = useTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      PaperProps={{
        sx: {
          background: Colors.backgroundSidenav,
          boxShadow: "-1px 0px 0px 0px rgba(228, 228, 228, 0.10) inset",
        },
      }}
      variant="permanent"
      open={open}
      {...props}
    >
      <DrawerHeader
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: open ? "30px" : "18px",
        }}
      >
        <Box sx={{
          display: open ? "block" : "none"
        }}>
          <img src="/logo.svg" />
        </Box>
        <IconButton
          onClick={toggleDrawer}
          sx={{
            borderRadius: "8px",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
            transform: open ? "none" : "rotate(180deg)",
            marginTop: open ? 0 : '12px',
            padding: "10px",
          }}
        >
          <img src="/arrow.svg" />
        </IconButton>
      </DrawerHeader>
      <List>
        <ListSubheader
          sx={{
            paddingLeft: "40px",
            background: "unset",
            fontSize: "14px",
            lineHeight: "16px",
            marginBottom: "20px",
            display: open ? "block" : "none"
          }}
        >
          Menu
        </ListSubheader>
        {items.map((item, index) => (
          <ListItem
            key={item.label}
            disablePadding
            sx={{
              margin: "0 16px",
              width: "unset",
              borderRadius: "12px",
              overflow: "hidden",
              border: item.active
                ? "1px solid #E2491A"
                : "1px solid transparent",
              background: item.active
                ? "rgba(226, 73, 26, 0.10)"
                : "transparent",
              height: open ? "unset" : "32px",
              marginBottom: open ? 0 : "16px"
            }}
          >
            <ListItemButton
              onClick={(e) => onNavClick(item.href)}
              sx={{
                padding: 0,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "24px",
                  marginLeft: open ? "20px" : "1px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
                sx={{
                  padding: "16px 24px 16px 20px",
                }}
                primary={item.label}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export { SidebarNavigation };