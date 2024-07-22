"use client";

import { Box, Typography } from "@mui/material";
import { CollectionsOverviewActiveSort, CollectionsOverviewEntryProps, CollectionsOverviewTimeOptions, Currency, TextSelectItemProps } from "@phoenix-protocol/types";
import {
  CollectionsOverview,
} from "@phoenix-protocol/ui";
import { useEffect, useState } from "react";

const demoItem = {
  id: "1234",
  previewImage: "/demo_nft.png",
  collectionName: "Demo Name",
  floorPrice: "1500.00",
  bestOffer: "1500.00",
  volume: "1500.00",
  volumePercent: "+20%",
  owners: "2137",
  ownersPercent: "20% Unique",
  forSalePercent: "16.19%",
  forSaleNumbers: "68 / 421",
};

export default function Page() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entries, setEntries] = useState<CollectionsOverviewEntryProps[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [categories, setCategories] = useState<TextSelectItemProps[]>([]);
  const [activeSort, setActiveSort] = useState<CollectionsOverviewActiveSort>({column: "collection", direction: "asc"});
  const [currency, setCurrency] = useState<Currency>("crypto");
  const [timeOption, setTimeOption] = useState<CollectionsOverviewTimeOptions>("1d");

  const fetchEntries = () => {
    setEntries([demoItem, demoItem, demoItem, demoItem, demoItem]);
  };

  const fetchCategories = () => {
    setCategories([
      {value: "all", label: "All Categories"}, 
      {value: "foo", label: "Foo"}, 
      {value: "bar", label: "Bar"}
    ]);
  };

  const onEntryClick = (id: string) => {
    alert(id)
  };

  useEffect(() => {
    fetchEntries();
    fetchCategories();
  }, [])

  return (
    <Box
      sx={{
        pt: 1.2,
        width: "100%",
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: "24px",
          lineHeight: "28px",
          fontWeight: 700,
          mb: 6,
        }}
      >
        Create
      </Typography>
      <Box mx={2} position="relative">
        <CollectionsOverview
          onEntryClick={onEntryClick}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          entries={entries}
          category={category}
          setCategory={setCategory}
          categoryItems={categories}
          activeSort={activeSort}
          setSort={setActiveSort}
          activeCurrency={currency}
          setActiveCurrency={setCurrency}
          activeTime={timeOption}
          setActiveTime={setTimeOption}
        />
      </Box>
    </Box>
  );
}
