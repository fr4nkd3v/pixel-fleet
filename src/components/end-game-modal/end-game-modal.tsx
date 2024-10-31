import { Button } from "../Button";
import { ShipFail, ShipSuccess } from "../Graph";
import styles from "./end-game-modal.module.css";
import { IEndGameModal } from "./end-game-modal.types";

export const EndGameModal = ({
  type,
  onToHomeClick,
  onRetryClick,
}: IEndGameModal) => {
  const isWinner = type === "win";
  const title = isWinner ? "Victoria!" : "Perdiste";
  const subtitle = isWinner ? "Bien jugado" : "Suerte para la próxima";
  const typeModalClass = isWinner
    ? styles["EndGameModal--isWinner"]
    : styles["EndGameModal--isLoser"];
  return (
    <>
      <div className={styles["EndGameModal-backdrop"]}></div>
      <div className={`${styles["EndGameModal"]} ${typeModalClass}`}>
        <p className={styles["EndGameModal-title"]}>{title}</p>
        <p className={styles["EndGameModal-subtitle"]}>{subtitle}</p>
        <div className={styles["EndGameModal-icon"]}>
          {isWinner ? <ShipSuccess /> : <ShipFail />}
        </div>
        <div className={styles["EndGameModal-actions"]}>
          <Button text="Ir a Inicio" onClick={onToHomeClick} />
          <Button text="Revancha" onClick={onRetryClick} />
        </div>
      </div>
    </>
  );
};
