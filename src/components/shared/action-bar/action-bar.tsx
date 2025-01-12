import { Card } from "~/components";
import css from "./action-bar.module.css";
import { useGameStore, usePlayerStore } from "~/stores";
import { StartControl } from "./start-control";
import { AttackControl } from "./attack-control";

export const ActionBar = () => {
  const { gamePhase, isPlayerTurn, isShooting, startGame } = useGameStore();
  const { fleet: playerFleet } = usePlayerStore();

  const isGameStart = gamePhase === "start";
  const isPlayerFleetDeployed = playerFleet.every((ship) => ship.isDeployed);

  const isStartControlDisabled = !isPlayerFleetDeployed;
  const isAttackControlDisabled =
    !isPlayerTurn || gamePhase !== "start" || isShooting;

  const isDisabled = isGameStart
    ? isAttackControlDisabled
    : isStartControlDisabled;

  const onStart = () => {
    if (!isPlayerFleetDeployed) return;
    startGame();
  };

  return (
    <Card
      cardClassName={css["Container-ActionBar"]}
      disabled={isDisabled}
      fullWidth
    >
      {isGameStart ? <AttackControl /> : <StartControl onStart={onStart} />}
    </Card>
  );
};
