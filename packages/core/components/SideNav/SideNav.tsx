import { useMediaQuery, useTheme } from "@mui/material";
import { SidebarNavigation } from "@phoenix-protocol/ui";
import Image from "next/image";
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
        <Image
          alt="Dashboard Icon"
          width={24}
          height={24}
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
        <Image
          width={24}
          height={24}
          alt="Swap Icon"
          src={pathname == "/swap" ? "/swapIconActive.svg" : "/swapIcon.svg"}
        />
      ),
      active: pathname == "/swap",
      href: "/swap",
    },
    {
      label: "Pools",
      icon: (
        <Image
          alt="Pools Icon"
          width={24}
          height={24}
          src={pathname == "/pools" ? "/poolsIconActive.svg" : "/poolsIcon.svg"}
        />
      ),
      active: pathname == "/pools",
      href: "/pools",
    },
    {
      label: "Trade History",
      icon: (
        <Image
          alt="History Icon"
          width={24}
          height={24}
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
      open={navOpen}
      setOpen={setNavOpen}
    />
  );
};

export default SideNav;
