import { Input } from "~/components";
import css from "./input-group.module.css";
import clsx from "clsx";
import { IInputGroupProps } from "./input-group.types";

export const InputGroup = ({
  addonType,
  addonLocation = "leading",
  inputClassName = "",
  ...props
}: IInputGroupProps) => {
  const label = (
    <label
      htmlFor={props.id}
      className={clsx(
        css["InputGroup-label"],
        addonLocation === "leading" ? css["is-leading"] : css["is-trailing"]
      )}
    >
      {addonType === "numeric" ? (
        <>
          12
          <br />
          34
        </>
      ) : (
        <>
          AB
          <br />
          CD
        </>
      )}
    </label>
  );

  return (
    <div className={css["InputGroup"]}>
      {addonLocation === "leading" && label}
      <Input
        className={clsx(css["InputGroup-input"], inputClassName)}
        {...props}
      />
      {addonLocation === "trailing" && label}
    </div>
  );
};
