import { Button } from "../button";
import { ShipFailGraph, ShipSuccessGraph } from "../graph";
import styles from "./end-game-modal.module.css";
import { IEndGameModal } from "./end-game-modal.types";

export const EndGameModal = ({
  isVisible = true,
  type,
  onToHomeClick,
  onRetryClick,
}: IEndGameModal) => {
  if (!isVisible) return null;

  const isWinner = type === "win";
  const title = isWinner ? "¡Victoria!" : "Perdiste";
  const subtitle = isWinner ? "Bien jugado" : "Suerte para la próxima";
  const typeModalClass = isWinner
    ? styles["EndGameModal--isWinner"]
    : styles["EndGameModal--isLoser"];
  return (
    <>
      <div className={styles["EndGameModal-backdrop"]}></div>
      <div className={`${styles["EndGameModal"]} ${typeModalClass}`}>
        <div className={styles["EndGameModal-text"]}>
          <p className={styles["EndGameModal-title"]}>{title}</p>
          <p className={styles["EndGameModal-subtitle"]}>{subtitle}</p>
        </div>
        <div className={styles["EndGameModal-icon"]}>
          {isWinner ? (
            <ShipSuccessGraph size="100%" />
          ) : (
            <ShipFailGraph size="100%" />
          )}
        </div>
        <div className={styles["EndGameModal-actions"]}>
          <Button
            variant={isWinner ? "success" : "dark"}
            text="Inicio"
            onClick={onToHomeClick}
          />
          <Button
            variant={isWinner ? "success" : "dark"}
            text="Revancha"
            onClick={onRetryClick}
          />
        </div>
      </div>
    </>
  );
};
