import { SidebarNavigation } from "@phoenix-protocol/ui";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BugReport } from "@mui/icons-material";
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
      label: "Earn",
      icon: (
        <Image
          alt="Earn Icon"
          width={24}
          height={24}
          src={pathname == "/earn" ? "/earnIconActive.svg" : "/earnIcon.svg"}
        />
      ),
      active: pathname == "/earn",
      href: "/earn",
    },
    {
      label: "Marketplace",
      icon: (
        <Image
          alt="Marketplace Icon"
          width={24}
          height={24}
          src={
            pathname.includes("marketplace")
              ? "/marketplaceIconActive.svg"
              : "/marketplaceIcon.svg"
          }
        />
      ),
      active: pathname == "/marketplace",
      href: "/marketplace",
      childItems: [
        {
          label: "Collections",
          active: pathname.includes("marketplace/collections"),
          href: "/marketplace/collections",
        },
        {
          label: "NFTs",
          active: pathname.includes("marketplace/nfts"),
          href: "/marketplace/nfts",
        },
        {
          label: "Create",
          active: pathname.includes("marketplace/create"),
          href: "/marketplace/create",
        },
      ],
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
      label: "History",
      icon: (
        <Image
          alt="Statistics Icon"
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

  const bottomNavItems = [
    {
      label: "Help Center",
      icon: (
        <img
          src={
            pathname == "/help-center"
              ? "/helpCenterIconActive.svg"
              : "/helpCenterIcon.svg"
          }
        />
      ),
      active: pathname == "/help-center",
      href: "/help-center",
    },
    {
      label: "Report Bug",
      icon: <BugReport />,
      active: pathname == "/bugreport",
      href: "https://discord.gg/2nGnFaprqy",
      target: "_blank",
    },
  ];

  const onNavClick = (href: string, target?: string) => {
    if (target === "_blank") {
      window.open(href, "_blank");
      return;
    }
    router.push(href);
  };

  return (
    <SidebarNavigation
      onNavClick={onNavClick}
      items={navItems}
      bottomItems={bottomNavItems}
      open={navOpen}
      setOpen={setNavOpen}
    />
  );
};

export default SideNav;
