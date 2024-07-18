import { TextSelectItemProps } from "./Shared";

export interface CreateNftBulkEntryProps {
  id: number;
  name: string;
  description: string;
  file: File;
  _onChange?: (id: number, key: string, value: string) => void; //only used in child card component
}

export interface CreateNftBulkProps {
  onBackButtonClick: () => void;
  onSubmitClick: () => void;
  onCreateCollectionClick: () => void;
  categories: TextSelectItemProps[];
  category: string;
  setCategory: (category: string) => void;
  entries: CreateNftBulkEntryProps[];
  setEntries: (entries: CreateNftBulkEntryProps[] | ((prevEntries: CreateNftBulkEntryProps[]) => CreateNftBulkEntryProps[])) => void;
}
