import { IIconBaseProps } from "./icon.types";

export const ShipIcon = ({
  color = "currentcolor",
  size = "30px",
}: IIconBaseProps) => {
  return (
    <svg
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2 1H7.53333V4.73333H4.73333V13.1333H1V18.7333H1.93333V24.3333H5.66667V23.4H10.3333V24.3333H15V23.4H19.6667V24.3333H23.4V21.5333H25.2667V18.7333H27.1333V15.9333H29V13.1333H22.4667V10.3333H20.6V7.53333H18.7333V4.73333H12.2V1ZM16.8667 10.3333H18.7333V13.1333H7.53333V7.53333H16.8667V10.3333Z"
        fill={color}
      />
      <path
        d="M9.4 25.2666H6.6V26.1999H1V28.9999H6.6V28.0666H9.4V28.9999H15.9333V28.0666H18.7333V28.9999H24.3333V28.0666H27.1333V25.2666H24.3333V26.1999H18.7333V25.2666H15.9333V26.1999H9.4V25.2666Z"
        fill={color}
      />
    </svg>
  );
};
