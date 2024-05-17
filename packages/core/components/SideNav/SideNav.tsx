import { useMediaQuery, useTheme } from "@mui/material";
import { SidebarNavigation } from "@phoenix-protocol/ui";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const SideNav = ({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      icon: (
        <img
          src={
            pathname == "/" ? "/dashboardIconActive.svg" : "/dashboardIcon.svg"
          }
        />
      ),
      active: pathname == "/",
      href: "/",
    },
    {
      label: "Swap",
      icon: (
        <img
          src={pathname == "/swap" ? "/swapIconActive.svg" : "/swapIcon.svg"}
        />
      ),
      active: pathname == "/swap",
      href: "/swap",
    },
    {
      label: "Pools",
      icon: (
        <img
          src={pathname == "/pools" ? "/poolsIconActive.svg" : "/poolsIcon.svg"}
        />
      ),
      active: pathname == "/pools",
      href: "/pools",
    },
    {
      label: "Trade History",
      icon: (
        <img
          src={
            pathname == "/history"
              ? "/tradeHistoryIconActive.svg"
              : "/tradeHistoryIcon.svg"
          }
        />
      ),
      active: pathname == "/history",
      href: "/history",
    },
  ];

  const onNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <SidebarNavigation
      onNavClick={onNavClick}
      items={navItems}
      bottomItems={[]}
      open={navOpen}
      setOpen={setNavOpen}
    />
  );
};

export default SideNav;
