import { TextSelectItemProps } from "./Shared";

export interface CreateCollectionProps {
  onBackButtonClick: () => void;
  onSubmitClick: () => void;
  name: string;
  setName: (name: string) => void;
  symbol: string;
  setSymbol: (name: string) => void;
  description: string;
  setDescription: (name: string) => void;
  setFile: (file: File) => void;
  previewImage: string | undefined;
  categories: TextSelectItemProps[];
  category: string;
  setCategory: (category: string) => void;
}
