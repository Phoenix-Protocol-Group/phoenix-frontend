import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SidebarNavigation } from "./SidebarNavigation";
import MailIcon from '@mui/icons-material/Mail';

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof SidebarNavigation> = {
  title: "Components/SidebarNavigation",
  component: SidebarNavigation
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof SidebarNavigation>;

export const Primary: Story = {
  args: {
    open: true,
    items: [
      {
        label: "Nav Item 1",
        icon: <MailIcon/>,
        active: true,
        href: "#"
      },
      {
        label: "Nav Item 2",
        icon: <MailIcon/>,
        active: false,
        href: "#"
      },
      {
        label: "Nav Item 3",
        icon: <MailIcon/>,
        active: false,
        href: "#"
      },
      {
        label: "Nav Item 4",
        icon: <MailIcon/>,
        active: false,
        href: "#"
      }
    ]
  },
};


export const Secondary: Story = {
  args: {
    open: false,
    items: [
      {
        label: "Nav Item 1",
        icon: <MailIcon/>,
        active: true,
        href: "#"
      },
      {
        label: "Nav Item 2",
        icon: <MailIcon/>,
        active: false,
        href: "#"
      },
      {
        label: "Nav Item 3",
        icon: <MailIcon/>,
        active: false,
        href: "#"
      },
      {
        label: "Nav Item 4",
        icon: <MailIcon/>,
        active: false,
        href: "#"
      }
    ]
  },
};
