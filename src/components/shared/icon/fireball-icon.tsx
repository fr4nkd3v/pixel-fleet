import { IIconBaseProps } from "./icon.types";

export const FireballIcon = ({
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
        d="M52.4 4H71v3.113h3.1v3.113h3.1V35.13h-3.1v6.226H71v6.227h-3.1v3.113h-3.1v-9.34h-3.1v6.227h-3.1v6.226h-3.1v6.226h-3.1v3.113h-3.1v3.113h-3.1V53.809H40v3.113h-6.2v3.113h-3.1v3.113h-6.2v3.113h-6.2v3.113h-6.2v3.113H5.9v-3.113H9V66.26h3.1v-6.226h3.1v-3.113h3.1v-6.226h3.1v-3.113h3.1V44.47h3.1v-3.114H15.2v-3.113h3.1V35.13h3.1v-3.113h3.1v-3.113h3.1v-3.113h3.1v-3.113h3.1v-3.113h-6.2v-3.113h-3.1V13.34h9.3v-3.113h9.3V7.113h9.3zM71 25.791h-6.2v3.113h-3.1v-3.113h-6.2v-6.226h-3.1v-3.113h3.1v-6.226h6.2V7.113h3.1v3.113H71v6.226h3.1v3.113H71z"
        fill={color}
      />
      <path d="M5.9 72.487V75.6H2.8v-3.113z" fill={color} />
    </svg>
  );
};
