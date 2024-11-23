import clsx from "clsx";
import { Button } from "../button";
import { ShipFailGraph, ShipSuccessGraph } from "../graph";
import css from "./results-modal.module.css";
import { IResultsModal } from "./results-modal.types";

export const ResultsModal = ({
  isVisible = true,
  type,
  onToHomeClick,
  onRetryClick,
}: IResultsModal) => {
  if (!isVisible) return null;

  const isWinner = type === "win";
  const title = isWinner ? "¡Victoria!" : "Perdiste";
  const subtitle = isWinner ? "Bien jugado" : "Suerte para la próxima";

  const combinedClasses = clsx(
    css["ResultsModal"],
    isWinner ? css["ResultsModal--isWinner"] : css["ResultsModal--isLoser"]
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
          {isWinner ? (
            <ShipSuccessGraph size="100%" />
          ) : (
            <ShipFailGraph size="100%" />
          )}
        </div>
        <div className={css["ResultsModal-actions"]}>
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
