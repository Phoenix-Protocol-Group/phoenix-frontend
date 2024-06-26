import { ButtonProps as MuiButtonProps } from "@mui/material";

export type Modify<T, R> = Omit<T, keyof R> & R;

export interface ButtonProps
  extends Modify<
    MuiButtonProps,
    {
      type?: "primary" | "secondary";
      size?: "medium" | "small";
      label?: string;
    }
  > {}
