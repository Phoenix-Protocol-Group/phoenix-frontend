import Colors from "../Theme/colors";
import React, { useEffect } from "react";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DrawerProps } from "@phoenix-protocol/types";
import { motion, MotionProps } from "framer-motion"; // Import MotionProps

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
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

// Define props interface for DrawerMotion
interface DrawerMotionProps extends MotionProps {
  open?: boolean;
}

const DrawerMotion = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerMotionProps>(({ theme, open }) => ({
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
  bottomItems,
}: DrawerProps) => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
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
    <DrawerMotion
      initial={{ width: 0 }}
      animate={{ width: open ? drawerWidth : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      open={open} // Pass open prop to DrawerMotion
    >
      <MuiDrawer
        PaperProps={{
          sx: {
            background: "var(--neutral-900, #171717)", // Adjusted background
            boxShadow: "-1px 0px 0px 0px rgba(228, 228, 228, 0.10) inset",
            maxWidth: "100vw",
          },
        }}
        variant="permanent"
        open={open} // Pass open prop to MuiDrawer
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
                <img alt="arrow" src="/arrow.svg" />
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
          <ItemList
            items={items}
            setOpen={setOpen}
            largerThenMd={largerThenMd}
            onNavClick={onNavClick}
            open={open}
          />
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
                <img alt="arrow" src="/arrow.svg" />
              </IconButton>
            </ListItem>
          )}
        </List>
        {bottomItems && (
          <List sx={{ position: "absolute", bottom: "2rem", width: "100%" }}>
            <ItemList
              items={bottomItems}
              setOpen={setOpen}
              largerThenMd={largerThenMd}
              onNavClick={onNavClick}
              open={open}
            />
          </List>
        )}
      </MuiDrawer>
    </DrawerMotion>
  );
};

const ItemList = ({
  items,
  setOpen,
  largerThenMd,
  onNavClick,
  open,
}: {
  items: any[];
  setOpen: (open: boolean) => void;
  largerThenMd: boolean;
  onNavClick: (href: string, target?: string) => void;
  open: boolean;
}) => {
  return (
    <>
      {items.map((item) => (
        <ListItem
          key={item.label}
          disablePadding
          className={item.label}
          sx={{
            margin: open ? "0 16px" : "auto",
            width: "unset",
            borderRadius: "12px",
            overflow: "hidden",
            border: item.active
              ? open
                ? "2px solid #E2491A"
                : "1px solid transparent"
              : "none",
            background: item.active
              ? open
                ? "rgba(226, 73, 26, 0.10)"
                : "transparent"
              : "transparent",
            height: open ? "unset" : "32px",
            marginBottom: open ? 0 : "16px",
            padding: open ? "0" : "4px", // Reduced padding when closed
          }}
        >
          <ListItemButton
            onClick={() => {
              if (!largerThenMd) {
                setOpen(false);
              }
              onNavClick(item.href, item.target);
            }}
            sx={{
              padding: 0,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "32px", // Increased icon size
                marginLeft: open ? "20px" : "auto", // Reduced margin when closed
                marginRight: open ? "8px" : "auto", // Removed margin when closed
                justifyContent: "center", // Center the icon
                // Colorize the icon when active to #E2491A
                color: item.active ? "#E2491A" : "rgba(255, 255, 255, 0.6)",
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
                opacity: item.active ? 1 : 0.6,
                display: open ? "block" : "none", // Hide text when closed
              }}
              primary={item.label}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export { SidebarNavigation };
