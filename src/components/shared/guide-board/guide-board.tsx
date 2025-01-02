import { Card, Icon } from "~/components";
import css from "./guide-board.module.css";
import { useGameStore, useOpponentStore } from "~/stores";
import { useTranslation } from "react-i18next";

export const GuideBoard = () => {
  const { gamePhase, isPlayerTurn, isShooting } = useGameStore();
  const { targetCoordinates } = useOpponentStore();
  const { t } = useTranslation();

  const getTranslationKey = () => {
    if (gamePhase === "prestart") return "player_deploy";
    if (gamePhase === "start") {
      if (isPlayerTurn) return "player_attack";
      if (!targetCoordinates && !isShooting) return "opponent_calculating";
      if (targetCoordinates && !isShooting) return "opponent_in_sight";
      if (targetCoordinates && isShooting) return "opponent_shooting";
    }
  };

  const key = getTranslationKey();

  return (
    <Card>
      <article className={css["GuideBoard"]}>
        <div className={css["GuideBoard-icon"]}>
          <Icon name="map" size="100%" />
        </div>
        <div className={css["GuideBoard-info"]}>
          <h1 className={css["GuideBoard-title"]}>
            {t(`guide_messages:${key}.title`)}
          </h1>
          <p className={css["GuideBoard-desc"]}>
            {t(`guide_messages:${key}.description`)}
          </p>
        </div>
      </article>
    </Card>
  );
};
