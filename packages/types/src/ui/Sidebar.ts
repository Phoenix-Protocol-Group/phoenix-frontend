import { DrawerProps as MuiDrawerProps } from "@mui/material";
export interface SidebarItems {
  label: string;
  icon?: any;
  active: boolean;
  href: string;
  target?: string;
  childItems?: SidebarItems[],
}

export interface DrawerProps extends MuiDrawerProps {
  items: SidebarItems[];
  bottomItems?: SidebarItems[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onNavClick: (href: string, target?: string) => void;
}
