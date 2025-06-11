import { TextSelectItemProps } from "./Shared";

export interface CreateNftProps {
  onBackButtonClick: () => void;
  onSubmitClick: () => void;
  onCreateCollectionClick: () => void;
  categories: TextSelectItemProps[];
  category: string;
  setCategory: (category: string) => void;
  setFile: (file: File) => void;
  name: string;
  setName: (name: string) => void;
  supply: string;
  setSupply: (name: string) => void;
  description: string;
  setDescription: (name: string) => void;
  code: string;
  setCode: (name: string) => void;
  previewImage: string | undefined;
}
