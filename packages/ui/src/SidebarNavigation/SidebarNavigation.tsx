import Colors from "../Theme/colors";
import React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  DrawerProps as MuiDrawerProps,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useEffect } from "react";

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
  [theme.breakpoints.down("md")]: {
    width: "100%",
    top: "70px",
    paddingTop: 2,
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
  [theme.breakpoints.up("md")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  [theme.breakpoints.down("md")]: {
    top: "70px",
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

const SidebarNavigation = ({
  items,
  open,
  setOpen,
  onNavClick,
  ...props
}: DrawerProps) => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));

  React.useEffect(() => {
    if (!largerThenMd && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [largerThenMd, open]);

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
      {largerThenMd && (
        <DrawerHeader
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: open ? "30px" : "18px",
          }}
        >
          <Box
            component="img"
            alt="Phoenix Logo"
            sx={open ? { maxWidth: "128px" } : { mx: "-8px" }}
            src={open ? "/logo.png" : "/logo_icon.svg"}
          />
          {open && (
            <IconButton
              onClick={toggleDrawer}
              sx={{
                borderRadius: "8px",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
                transform: open ? "none" : "rotate(180deg)",
                marginTop: open ? 0 : "12px",
                marginLeft: "8px",
                padding: "10px",
              }}
            >
              <img src="/arrow.svg" />
            </IconButton>
          )}
        </DrawerHeader>
      )}
      <List>
        <ListSubheader
          sx={{
            paddingLeft: "40px",
            background: "unset",
            fontSize: "14px",
            lineHeight: "16px",
            marginBottom: "20px",
            display: open ? "block" : "none",
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
              border: item.active && open
                ? "1px solid #E2491A"
                : "1px solid transparent",
              background: item.active && open
                ? "rgba(226, 73, 26, 0.10)"
                : "transparent",
              height: open ? "unset" : "32px",
              marginBottom: open ? 0 : "16px",
            }}
          >
            <ListItemButton
              onClick={() => {
                if (!largerThenMd) {
                  setOpen(false);
                }
                onNavClick(item.href);
              }}
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
                  opacity: item.active ? 1 :0.6000000238418579
                }}
                primary={item.label}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {!open && (
          <ListItem>
            <IconButton
              onClick={toggleDrawer}
              sx={{
                borderRadius: "8px",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
                transform: open ? "none" : "rotate(180deg)",
                marginTop: open ? 0 : "12px",
                padding: "10px",
              }}
            >
              <img src="/arrow.svg" />
            </IconButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export { SidebarNavigation };

