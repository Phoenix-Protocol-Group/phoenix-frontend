import type { Meta, StoryObj } from "@storybook/react";
import CreateNft from "./CreateNft";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CreateNft> = {
  title: "Marketplace/CreateNft",
  // @ts-ignore
  component: CreateNft,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CreateNft>;

export const Primary: Story = {
  args: {
    onBackButtonClick: () => {},
    onSubmitClick: () => {},
    onCreateCollectionClick: () => {},
    categories: [
      { label: '1', value: 'Art' },
      { label: '2', value: 'Photography' },
      { label: '3', value: 'Music' },
    ],
    category: 'Art',
    setCategory: (category: string) => {},
    setFile: (file: File) => {},
    name: 'My NFT',
    setName: (name: string) => {},
    supply: '1',
    setSupply: (supply: string) => {},
    description: 'This is a demo NFT description.',
    setDescription: (description: string) => {},
    externalLink: 'https://example.com',
    setExternalLink: (externalLink: string) => {},
    previewImage: undefined,
  },
};
