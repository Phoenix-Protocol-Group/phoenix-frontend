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
import { motion, MotionProps } from "framer-motion";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../Theme/styleConstants";

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
    paddingTop: spacing.md,
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
    width: `calc(${theme.spacing(10)} + 1px)`, // Increased from 8 to 10
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
      animate={{ width: open ? drawerWidth : largerThenMd ? 80 : 0 }} // Explicit width when closed
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      open={open}
    >
      <MuiDrawer
        PaperProps={{
          sx: {
            background: colors.neutral[900],
            boxShadow: `0 0 1px 0 ${colors.neutral[700]}`,
            maxWidth: "100vw",
          },
        }}
        variant="permanent"
        open={open}
      >
        {largerThenMd && (
          <DrawerHeader
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: open ? spacing.xl : spacing.md,
              minHeight: "64px", // Ensure consistent height
            }}
          >
            <Box
              component="img"
              alt="Phoenix Logo"
              sx={
                open
                  ? { maxWidth: "128px" }
                  : {
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                      margin: "0 0 0 -13px",
                    }
              }
              src={open ? "/logo.png" : "/logo_icon.svg"}
            />
            {open && (
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  borderRadius: borderRadius.md,
                  background: `linear-gradient(180deg, ${colors.neutral[800]} 0%, ${colors.neutral[900]} 100%)`,
                  transform: open ? "none" : "rotate(180deg)",
                  marginTop: open ? 0 : spacing.sm,
                  marginLeft: spacing.sm,
                  padding: spacing.xs,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: colors.neutral[800],
                  },
                }}
              >
                <Box component="img" alt="arrow" src="/arrow.svg" />
              </IconButton>
            )}
          </DrawerHeader>
        )}
        <List>
          <ListSubheader
            sx={{
              paddingLeft: spacing.xxl,
              background: "transparent",
              fontSize: typography.fontSize.sm,
              lineHeight: "16px",
              marginBottom: spacing.lg,
              display: open ? "block" : "none",
              color: colors.neutral[400],
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
            <ListItem
              sx={{
                justifyContent: "center",
                marginTop: spacing.md,
              }}
            >
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  borderRadius: borderRadius.md,
                  background: `linear-gradient(180deg, ${colors.neutral[800]} 0%, ${colors.neutral[900]} 100%)`,
                  transform: "rotate(180deg)",
                  padding: spacing.sm,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: colors.neutral[800],
                  },
                }}
              >
                <Box component="img" alt="arrow" src="/arrow.svg" />
              </IconButton>
            </ListItem>
          )}
        </List>
        {bottomItems && (
          <List
            sx={{ position: "absolute", bottom: spacing.lg, width: "100%" }}
          >
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
            margin: open ? `0 ${spacing.sm}` : "0 auto",
            width: open ? "unset" : "80%",
            borderRadius: borderRadius.lg,
            overflow: "hidden",
            border: item.active
              ? open
                ? `2px solid ${colors.primary.main}`
                : `none`
              : "none",
            background: item.active
              ? open
                ? `rgba(${colors.primary.gradient}, 0.1)`
                : `rgba(${colors.primary.gradient}, 0.05)`
              : "transparent",
            height: "auto", // Changed from fixed height
            marginBottom: spacing.xs,
            marginTop: spacing.xs,
            padding: open ? 0 : spacing.xs,
            transition: "all 0.2s ease",
            "&:hover": {
              background: item.active
                ? open
                  ? `rgba(${colors.primary.gradient}, 0.2)`
                  : `rgba(${colors.primary.gradient}, 0.1)`
                : open
                ? colors.neutral[800]
                : colors.neutral[800],
            },
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
              padding: open ? 0 : spacing.xs,
              justifyContent: open ? "flex-start" : "center",
              minHeight: "40px",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open ? "32px" : "24px",
                width: open ? "32px" : "24px",
                marginLeft: open ? spacing.lg : 0,
                marginRight: open ? spacing.sm : 0,
                justifyContent: "center",
                color: item.active ? colors.primary.main : colors.neutral[400],
                transition: "color 0.2s ease",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                fontSize: typography.fontSize.sm,
                fontWeight: item.active
                  ? typography.fontWeights.medium
                  : typography.fontWeights.regular,
                lineHeight: "20px",
                fontFamily: typography.fontFamily,
                color: item.active ? colors.neutral[50] : colors.neutral[300],
              }}
              sx={{
                padding: `${spacing.md} ${spacing.lg} ${spacing.md} ${spacing.md}`,
                opacity: 1,
                display: open ? "block" : "none",
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
