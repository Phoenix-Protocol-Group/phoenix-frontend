import React, { useEffect, useState } from "react";
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
  Collapse,
} from "@mui/material";
import { DrawerProps } from "@phoenix-protocol/types";
import { motion, MotionProps } from "framer-motion";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
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
    width: "100vw", // Full viewport width
    top: 0, // Fullscreen mobile navigation
    paddingTop: 0, // Remove extra padding since we have the header
    position: "fixed",
    height: "100vh", // Fullscreen height
    left: 0, // Ensure it starts from the left edge
    background:
      "linear-gradient(135deg, rgba(15, 15, 15, 0.98) 0%, rgba(25, 25, 25, 0.98) 100%)",
    backdropFilter: "blur(20px)",
    zIndex: 1350, // Ensure it's above overlay and AppBar
    // Enhanced mobile styles
    borderRight: "none", // Remove border on full width
    boxShadow: "none", // Remove shadow on full width
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
    top: "70px", // Account for mobile TopBar
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

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [largerThenMd, open]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!largerThenMd && open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            zIndex: 1299, // Below navigation
          }}
          onClick={() => setOpen(false)}
        />
      )}

      <DrawerMotion
        initial={{
          width: largerThenMd ? 0 : "100vw",
          x: largerThenMd ? -drawerWidth : "-100vw",
        }}
        animate={{
          width: open
            ? largerThenMd
              ? drawerWidth
              : "100vw"
            : largerThenMd
            ? 80
            : "100vw",
          x: largerThenMd ? 0 : open ? 0 : "-100vw",
        }}
        transition={
          largerThenMd
            ? {
                type: "spring",
                stiffness: 400,
                damping: 40,
                duration: 0.4,
              }
            : {
                type: "tween",
                ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smooth mobile animation
                duration: 0.3,
              }
        }
        open={open}
      >
        <MuiDrawer
          PaperProps={{
            sx: {
              background: largerThenMd
                ? colors.neutral[900]
                : "linear-gradient(135deg, rgba(15, 15, 15, 0.98) 0%, rgba(25, 25, 25, 0.98) 100%)",
              boxShadow: largerThenMd
                ? `0 0 1px 0 ${colors.neutral[700]}`
                : "0 8px 32px rgba(0, 0, 0, 0.4)",
              maxWidth: "100vw",
              width: "100%",
              border: "none",
              backdropFilter: !largerThenMd ? "blur(20px)" : "none",
              zIndex: !largerThenMd ? 1350 : "auto", // Ensure mobile drawer is above overlay and AppBar
              willChange: !largerThenMd ? "transform" : "auto", // Optimize for mobile animations
            },
          }}
          variant="permanent"
          open={open}
        >
          {/* Mobile Header with Close Button */}
          {!largerThenMd && open && (
            <DrawerHeader
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: `${spacing.lg} ${spacing.xl}`,
                minHeight: "70px", // Match AppBar height
                borderBottom: `1px solid rgba(249, 115, 22, 0.2)`,
                marginBottom: spacing.md,
              }}
            >
              <Box
                component="img"
                alt="Phoenix Logo"
                sx={{ maxWidth: "128px" }}
                src="/logo.png"
              />
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  color: "#FAFAFA",
                  padding: { xs: "6px", md: "8px" },
                  background: "rgba(249, 115, 22, 0.1)",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(249, 115, 22, 0.2)",
                    borderColor: "rgba(249, 115, 22, 0.4)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </IconButton>
            </DrawerHeader>
          )}

          {/* Desktop Header */}
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
    </>
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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Auto-expand items that have active child items
  useEffect(() => {
    const autoExpandItems: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.childItems && item.childItems.length > 0) {
        const hasActiveChild = item.childItems.some(
          (child: any) => child.active
        );
        if (hasActiveChild) {
          autoExpandItems[item.label] = true;
        }
      }
    });
    setExpandedItems((prev) => ({ ...prev, ...autoExpandItems }));
  }, [items]);

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item.label}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: items.indexOf(item) * 0.05 }}
            whileHover={{ scale: open ? 1.02 : 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem
              disablePadding
              className={item.label}
              sx={{
                margin: open ? `0 ${spacing.sm}` : "0 auto",
                width: open ? "unset" : "80%",
                borderRadius: borderRadius.lg,
                overflow: "hidden",
                position: "relative",
                border: item.active
                  ? open
                    ? `1px solid rgba(249, 115, 22, 0.4)`
                    : `1px solid ${colors.primary.main}`
                  : "1px solid transparent",
                background: item.active
                  ? open
                    ? `linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(249, 115, 22, 0.03) 100%)`
                    : `linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)`
                  : "transparent",
                height: "auto",
                marginBottom: spacing.sm,
                marginTop: spacing.sm,
                padding: open ? 0 : spacing.xs,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                "&:hover": {
                  background: item.active
                    ? open
                      ? `linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.06) 100%)`
                      : `linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(249, 115, 22, 0.15) 100%)`
                    : open
                    ? `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[850]} 100%)`
                    : `linear-gradient(135deg, ${colors.neutral[700]} 0%, ${colors.neutral[800]} 100%)`,
                  borderColor: item.active
                    ? `rgba(249, 115, 22, 0.6)`
                    : colors.neutral[600],
                  transform: open ? "translateX(2px)" : "scale(1.05)",
                  boxShadow: item.active
                    ? `0 2px 12px rgba(249, 115, 22, 0.2)`
                    : `0 4px 15px rgba(0, 0, 0, 0.2)`,
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
                // Enhanced focus styles for accessibility
                "&:focus-within": {
                  outline: `2px solid ${colors.primary.main}`,
                  outlineOffset: "2px",
                },
                // Add subtle glow effect for active items
                ...(item.active && {
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, transparent 50%)`,
                    borderRadius: borderRadius.lg,
                    pointerEvents: "none",
                  },
                }),
                // Show tooltip for collapsed sidebar with child items
                ...(!open &&
                  item.childItems &&
                  item.childItems.length > 0 && {
                    "&:hover::after": {
                      content: `"${item.label} - Click to expand"`,
                      position: "absolute",
                      left: "100%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: colors.neutral[800],
                      color: colors.neutral[200],
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.xs,
                      whiteSpace: "nowrap",
                      marginLeft: spacing.sm,
                      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
                      zIndex: 1000,
                      pointerEvents: "none",
                    },
                  }),
              }}
            >
              <ListItemButton
                onClick={() => {
                  // Always navigate to the parent page first
                  if (!largerThenMd) {
                    setOpen(false);
                  }
                  onNavClick(item.href, item.target);
                }}
                sx={{
                  padding: open ? 0 : spacing.xs,
                  justifyContent: open ? "flex-start" : "center",
                  // Enhanced mobile touch area
                  minHeight: { xs: "48px", md: "40px" },
                  borderRadius: borderRadius.md,
                  // Add subtle haptic feedback simulation on mobile
                  "&:active": {
                    transform: !largerThenMd ? "scale(0.95)" : "scale(0.98)",
                    transition: "transform 0.1s ease",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? "32px" : "24px",
                    width: open ? "32px" : "24px",
                    marginLeft: open ? spacing.lg : 0,
                    marginRight: open ? spacing.sm : 0,
                    justifyContent: "center",
                    color: item.active
                      ? colors.primary.main
                      : colors.neutral[400],
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
                    color: item.active
                      ? colors.neutral[50]
                      : colors.neutral[300],
                  }}
                  sx={{
                    padding: `${spacing.md} ${spacing.lg} ${spacing.md} ${spacing.md}`,
                    opacity: 1,
                    display: open ? "block" : "none",
                  }}
                  primary={item.label}
                />
                {/* Expand/Collapse Button for items with children */}
                {item.childItems && item.childItems.length > 0 && open && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent navigation
                      toggleExpanded(item.label);
                    }}
                    sx={{
                      marginRight: spacing.md,
                      padding: spacing.xs,
                      color: colors.neutral[400],
                      transition: "all 0.2s ease",
                      borderRadius: borderRadius.sm,
                      "&:hover": {
                        backgroundColor: "rgba(249, 115, 22, 0.1)",
                        color: colors.primary.main,
                        transform: "scale(1.1)",
                      },
                      "&:active": {
                        transform: "scale(0.95)",
                      },
                    }}
                  >
                    {expandedItems[item.label] ? (
                      <ExpandLess sx={{ fontSize: "18px" }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: "18px" }} />
                    )}
                  </IconButton>
                )}
              </ListItemButton>
            </ListItem>
          </motion.div>

          {/* Child Items */}
          {item.childItems && item.childItems.length > 0 && open && (
            <Collapse
              in={expandedItems[item.label]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {item.childItems.map((childItem: any, childIndex: number) => (
                  <motion.div
                    key={childItem.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: childIndex * 0.05 }}
                  >
                    <ListItem
                      disablePadding
                      sx={{
                        margin: `0 ${spacing.lg} 0 ${spacing.lg}`,
                        width: `calc(100% - 2 * ${spacing.lg})`,
                        borderRadius: borderRadius.md,
                        marginBottom: spacing.xs,
                        background: childItem.active
                          ? `linear-gradient(135deg, rgba(249, 115, 22, 0.06) 0%, rgba(249, 115, 22, 0.03) 100%)`
                          : "transparent",
                        border: childItem.active
                          ? `1px solid rgba(249, 115, 22, 0.2)`
                          : "1px solid transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: childItem.active
                            ? `linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(249, 115, 22, 0.04) 100%)`
                            : `rgba(${colors.neutral[700]}, 0.3)`,
                          transform: "translateX(2px)",
                          borderColor: childItem.active
                            ? `rgba(249, 115, 22, 0.3)`
                            : "transparent",
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={() => {
                          if (!largerThenMd) {
                            setOpen(false);
                          }
                          onNavClick(childItem.href, childItem.target);
                        }}
                        sx={{
                          paddingLeft: spacing.xl,
                          paddingRight: spacing.sm,
                          paddingTop: spacing.sm,
                          paddingBottom: spacing.sm,
                          minHeight: "36px",
                          borderRadius: borderRadius.md,
                          "&:active": {
                            transform: "scale(0.98)",
                          },
                        }}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: typography.fontSize.xs,
                            fontWeight: childItem.active
                              ? typography.fontWeights.medium
                              : typography.fontWeights.regular,
                            color: childItem.active
                              ? colors.primary.main
                              : colors.neutral[400],
                            lineHeight: "16px",
                            fontFamily: typography.fontFamily,
                          }}
                          primary={childItem.label}
                        />
                      </ListItemButton>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export { SidebarNavigation };
