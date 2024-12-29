export interface IPanelProps {
  children: JSX.Element;
  width?: string;
  height?: string;
  shadowSize?: TShadow;
}

type TShadow = 'shadow-s' | 'shadow-m' | 'shadow-l';