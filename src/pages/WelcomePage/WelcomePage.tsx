import { Button } from "~/components/button";
import { Ship1 } from "~/components/Graph";
import styles from "./WelcomePage.module.css";

export const WelcomePage = () => {
  return (
    <div className={styles["WelcomePage-autocontainer"]}>
      <section className={styles["WelcomePage"]}>
        <div className={styles["WelcomPage-animation"]}>
          <div className={styles["WelcomPage-icon"]}>
            <Ship1 size="100%" />
          </div>
          vs
          <div className={styles["WelcomPage-icon"]}>
            <Ship1 size="100%" />
          </div>
        </div>
        <div className={styles["WelcomPage-text"]}>
          <h1 className={styles["WelcomPage-title"]}>BATALLA NAVAL</h1>
          <h2 className={styles["WelcomPage-subtitle"]}>
            Estrategia y Destrucción de Barcos
          </h2>
        </div>
        <div className={styles["WelcomPage-buttonsGroup"]}>
          <Button text="Start" onClick={() => console.log("click en start")} />
          <Button
            text="Settings"
            onClick={() => console.log("click en Settings")}
          />
        </div>
      </section>
    </div>
  );
};
