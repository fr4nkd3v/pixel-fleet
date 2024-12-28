import clsx from "clsx";
import { Button } from "../button";
import { ShipFailGraph, ShipSuccessGraph } from "../graph";
import css from "./results-modal.module.css";
import { IResultsModal } from "./results-modal.types";
import { useGameStore } from "~/stores";

export const ResultsModal = ({
  onRetryClick,
  onToHomeClick,
}: IResultsModal) => {
  const { isPlayerWins } = useGameStore();

  const title = isPlayerWins ? "¡Victoria!" : "Perdiste";
  const subtitle = isPlayerWins ? "Bien jugado" : "Suerte para la próxima";

  const combinedClasses = clsx(
    css["ResultsModal"],
    isPlayerWins ? css["ResultsModal--isWinner"] : css["ResultsModal--isLoser"]
  );

  return (
    <>
      <div className={css["ResultsModal-backdrop"]}></div>
      <div className={combinedClasses}>
        <div className={css["ResultsModal-text"]}>
          <p className={css["ResultsModal-title"]}>{title}</p>
          <p className={css["ResultsModal-subtitle"]}>{subtitle}</p>
        </div>
        <div className={css["ResultsModal-icon"]}>
          {isPlayerWins ? (
            <ShipSuccessGraph size="100%" />
          ) : (
            <ShipFailGraph size="100%" />
          )}
        </div>
        <div className={css["ResultsModal-actions"]}>
          <Button
            variant={isPlayerWins ? "success" : "dark"}
            text="Inicio"
            onClick={onToHomeClick}
          />
          <Button
            variant={isPlayerWins ? "success" : "dark"}
            text="Revancha"
            onClick={onRetryClick}
          />
        </div>
      </div>
    </>
  );
};
