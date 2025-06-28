import { Button } from "~/components/shared/button";
import { ShipGraph } from "~/components/shared/graph";
import styles from "./welcome-page.module.css";
import { useTranslation } from "react-i18next";
import { IWelcomePageProps } from "./welcome-page.types";

export const WelcomePage = ({ onPlay }: IWelcomePageProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles["WelcomePage-container"]}>
      <section className={styles["WelcomePage"]}>
        <div className={styles["WelcomePage-animation"]}>
          <div className={styles["WelcomePage-icon"]}>
            <ShipGraph size="100%" />
          </div>
          vs
          <div className={styles["WelcomePage-icon"]}>
            <ShipGraph size="100%" />
          </div>
        </div>
        <div className={styles["WelcomePage-text"]}>
          <h1 className={styles["WelcomePage-title"]}>{t("welcome:title")}</h1>
          <h2 className={styles["WelcomePage-subtitle"]}>
            {t("welcome:description")}
          </h2>
        </div>
        <div className={styles["WelcomePage-buttonsGroup"]}>
          <Button
            text={t("welcome:button.play")}
            onClick={onPlay}
          />
        </div>
      </section>
    </div>
  );
};
