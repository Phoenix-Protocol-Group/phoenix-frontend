import React, { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { SearchInput } from "./SearchInput";
import { Box } from "@mui/material";

export default {
  title: "Common/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof SearchInput>;

const Template: StoryFn<typeof SearchInput> = (args) => {
  const [value, setValue] = useState(args.value || "");
  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#171717", width: "300px" }}>
      <SearchInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Box>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: "Search",
  value: "",
};

export const WithValue = Template.bind({});
WithValue.args = {
  placeholder: "Search",
  value: "Token",
};

export const CustomPlaceholder = Template.bind({});
CustomPlaceholder.args = {
  placeholder: "Search by name or address",
  value: "",
};
