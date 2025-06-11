import { DrawerProps as MuiDrawerProps } from "@mui/material";

export interface SidebarChildItem {
  label: string;
  active: boolean;
  href: string;
  target?: string;
}

export interface SidebarItems {
  label: string;
  icon: any;
  active: boolean;
  href: string;
  target?: string;
  childItems?: SidebarChildItem[];
}

export interface DrawerProps extends MuiDrawerProps {
  items: SidebarItems[];
  bottomItems?: SidebarItems[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onNavClick: (href: string, target?: string) => void;
}
