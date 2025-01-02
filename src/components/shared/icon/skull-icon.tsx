import { IIconBaseProps } from "./icon.types";

export const SkullIcon = ({
  color = "currentcolor",
  size = "30px",
}: IIconBaseProps) => {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.4 6.4v2.8h-2.8V12h-2.8v2.8H14v2.8h-2.8v25.2H8.4V54h2.8v2.8h5.6v2.8h2.8v11.2h2.8v2.8H28v-8.4h2.8v-2.8h2.8v2.8h2.8v8.4H44v-8.4h2.8v-2.8h2.8v2.8h2.8v8.4H58v-2.8h2.8V59.6h2.8v-2.8h5.6V54H72V42.8h-2.8V17.6h-2.8v-2.8h-2.8V12h-2.8V9.2H58V6.4zm-5.6 28v-2.8h8.4v2.8H28v8.4h-2.8v2.8h-8.4v-2.8H14v-8.4zm38.4-2.8h8.4v2.8h2.8v8.4h-2.8v2.8h-8.4v-2.8h-2.8v-8.4h2.8zM36 51.6h-2.8V46H36v-2.8h2.8v-2.8h2.8v2.8h2.8V46h2.8v5.6h-5.6v-2.8H36z"
        fill={color}
      />
    </svg>
  );
};
