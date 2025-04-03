import type { Meta, StoryObj } from "@storybook/react";
import { SidebarNavigation } from "./SidebarNavigation";
import MailIcon from "@mui/icons-material/Mail";
import React from "react";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof SidebarNavigation> = {
  title: "Layout/SidebarNavigation",
  component: SidebarNavigation,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof SidebarNavigation>;

export const Open: Story = {
  args: {
    open: true,
    items: [
      {
        label: "Nav Item 1",
        icon: <MailIcon />,
        active: true,
        href: "#",
      },
      {
        label: "Nav Item 2",
        icon: <MailIcon />,
        active: false,
        href: "#",
      },
      {
        label: "Nav Item 3",
        icon: <MailIcon />,
        active: false,
        href: "#",
      },
      {
        label: "Nav Item 4",
        icon: <MailIcon />,
        active: false,
        href: "#",
      },
    ],
    bottomItems: [
      {
        label: "Nav Item 4",
        icon: <MailIcon />,
        active: false,
        href: "#",
      },
    ],
  },
};

export const Closed: Story = {
  args: {
    open: false,
    items: [
      {
        label: "Nav Item 1",
        icon: <MailIcon />,
        active: true,
        href: "#",
      },
      {
        label: "Nav Item 2",
        icon: <MailIcon />,
        active: false,
        href: "#",
      },
      {
        label: "Nav Item 3",
        icon: <MailIcon />,
        active: false,
        href: "#",
      },
      {
        label: "Nav Item 4",
        icon: <MailIcon />,
        active: false,
        href: "#",
      },
    ],
    bottomItems: [
      {
        label: "Nav Item 4",
        icon: <MailIcon />,
        active: false,
        href: "#",
      },
    ],
  },
};
