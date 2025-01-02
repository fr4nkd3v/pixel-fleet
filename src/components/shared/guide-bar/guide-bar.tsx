import { Card, Icon } from "~/components";
import css from "./guide-bar.module.css";
import { useGameStore, useOpponentStore } from "~/stores";
import { useTranslation } from "react-i18next";

export const GuideBar = () => {
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
      <article className={css["GuideBar"]}>
        <div className={css["GuideBar-icon"]}>
          <Icon name="map" size="100%" />
        </div>
        <div className={css["GuideBar-info"]}>
          <h1 className={css["GuideBar-title"]}>
            {t(`guide_messages:${key}.title`)}
          </h1>
          <p className={css["GuideBar-desc"]}>
            {t(`guide_messages:${key}.description`)}
          </p>
        </div>
      </article>
    </Card>
  );
};
