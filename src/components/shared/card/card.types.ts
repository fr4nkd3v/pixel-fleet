type TShadow = "shadow-s" | "shadow-m" | "shadow-l";

export interface ICardProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
  shadowSize?: TShadow;
}
