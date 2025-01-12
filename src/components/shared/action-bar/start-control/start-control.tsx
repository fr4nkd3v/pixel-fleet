import { Button } from "~/components";
import css from "../action-bar.module.css";
import { useTranslation } from "react-i18next";
import { IStartControlProps } from "./start-control.types";

export const StartControl = ({ onStart }: IStartControlProps) => {
  const { t } = useTranslation();

  return (
    <form className={css["ActionBar"]}>
      <Button
        text={t("game:button.start")}
        variant="primary"
        onClick={onStart}
        fullWidth
      />
    </form>
  );
};
