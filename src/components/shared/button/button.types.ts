export const buttonVariants = [
  "default",
  "primary",
  "secondary",
  "success",
  "dark",
] as const;

export type TButtonVariant = (typeof buttonVariants)[number];

export interface IButtonProps {
  text: string;
  variant?: TButtonVariant;
  disabled?: boolean;
  onClick: () => void;
}
