import { TextSelectItemProps } from "./Shared";

export interface CreateNftBulkEntryProps {
  id: number;
  name: string;
  description: string;
  file: File;
  onChange?: (id: number, key: string, value: string) => void; //only used in child card component
}

export interface CreateNftBulkProps {
  onBackButtonClick: () => void;
  onSubmitClick: () => void;
  categories: TextSelectItemProps[];
  category: string;
  setCategory: (category: string) => void;
  entries: CreateNftBulkEntryProps[];
  setEntries: (entries: CreateNftBulkEntryProps[] | ((prevEntries: CreateNftBulkEntryProps[]) => CreateNftBulkEntryProps[])) => void;
}
