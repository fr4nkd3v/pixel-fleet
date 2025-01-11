export interface ICardProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  variant?: "light" | "dark";
  disabled?: boolean;
  notShadow?: boolean;
  cardClassName?: string;
}
