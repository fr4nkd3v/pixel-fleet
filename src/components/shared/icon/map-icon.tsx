import { IIconBaseProps } from "./icon.types";

export const MapIcon = ({
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
        d="M35.079 18.974h9.842v3.131H35.08zm12.974 0v3.131h9.842v-3.131z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.947 6H9.132v3.132H6v35.79h3.132v3.13H6v22.816h3.132V74h61.736v-3.132H74v-9.842h-3.132v-3.131H74v-35.79h-3.132v-3.131H74V9.132h-3.132V6h-9.842v3.132h-3.131V6h-9.842v3.132H44.92V6h-9.84v3.132h-3.132zm0 12.974V9.132h-9.842v9.842zm3.132 0h-3.132v3.131h-9.842v9.842h9.842v-9.842h3.132v9.842h9.842v-9.842h3.132v9.842h9.842v-9.842h3.131v9.842h9.842v-9.842h-9.842v-3.131h9.842V9.132h-9.842v9.842h-3.131V9.132h-9.842v9.842H44.92V9.132h-9.84zm35.79 38.92h-9.843v-9.841h9.842zm0 3.132v9.842h-9.843v-9.842zM18.973 48.053v9.842H9.132v-9.842zm0-3.132v3.132h3.131v9.842h9.842v-9.842h-9.842V44.92h9.842v-9.84h-9.842v9.842zm0 0V35.08H9.132v9.842zm16.105 12.974h9.842v-9.842h-9.84zm12.974 0h9.842v-9.842h-9.842z"
        fill={color}
      />
    </svg>
  );
};
