import { useCallback, useEffect, useMemo, useState } from "react";
import css from "./game-page.module.css";
import { FleetMenu, BattleMap, CursorShadowShip, ResultsModal, GuideBar, ActionBar } from "~/components";
import { TCoordinates } from "~/types/game";
import { AVAILABLE_FLEET_IDS, COORDINATES_LENGTH } from "~/constants/game";
import {
  attackMap,
  autoFleetDeploy,
  getRandomCoordinate,
  calculatePlayerIsWinner,
  prepareFleet,
  isFleetDefeated,
  delay,
} from "~/utils";
import { useGameStore, useOpponentStore, usePlayerStore, useShipDeployStore } from "~/stores";
import { useBreakpoints } from "~/hooks";
import tileCSS from "~/components/shared/battle-map/tile/tile.module.css";
import { useCursorLocation } from "~/hooks/use-cursor-location";

export const GamePage = () => {
  // Set fleet & map size for each player

  // Generate fleet & map data for state
  const commonFleetArr = useMemo(() => prepareFleet(AVAILABLE_FLEET_IDS), []);
  const domRoot = useMemo(() => document.querySelector(":root"), []);

  const [scrollY, setScrollY] = useState(0);

  // ? MapArr structure
  // Is an array of coordinate objects that have been covered or attacked
  // If is empty means that all tiles of map are neither covered nor attacked
  /* Example:
  [
    {
      x: 'a',
      y: 1,
      covered: true,
      attacked: false,
    },
    ...
  ]
  */

  const {
    gamePhase,
    isPlayerTurn,
    isPlayerWins,
    endGame,
    startsShooting,
    endShooting,
    setPlayerWins,
    restartState: restartGameState,
    endShootingAndToggleTurn,
  } = useGameStore();

  const {
    fleet: opponentFleet,
    map: opponentMap,
    targetCoordinates: opponentTargetCoordinates,
    setFleet: setOpponentFleet,
    setMap: setOpponentMap,
    setTargetCoordinates: setOpponentTargetCoordinates,
    restartState: restartOpponentState,
  } = useOpponentStore();

  const {
    fleet: playerFleet,
    map: playerMap,
    targetCoordinates: playerTargetCoordinates,
    setFleet: setPlayerFleet,
    setMap: setPlayerMap,
    restartState: restartPlayerState,
  } = usePlayerStore();

  const { restartState: restartShipDeployState } = useShipDeployStore();
  const { isDesktopOrHigher } = useBreakpoints();
  const { cursorLocation } = useCursorLocation();

  const isPlayerFleetDeployed = playerFleet.every((ship) => ship.isDeployed);

  const restartGame = useCallback(() => {
    restartGameState();
    restartOpponentState();
    restartPlayerState();
    restartShipDeployState();
  }, [restartGameState, restartOpponentState, restartPlayerState, restartShipDeployState]);

  const handlePlayerFinishesShot = useCallback(() => {
    if (!playerTargetCoordinates.x || !playerTargetCoordinates.y) return;

    const { fleet: newOpponentFleet, map: newOpponentMap } = attackMap(
      playerTargetCoordinates as TCoordinates,
      opponentMap,
      opponentFleet,
    );
    setOpponentMap(newOpponentMap);
    setOpponentFleet(newOpponentFleet);

    if (isFleetDefeated(newOpponentFleet)) {
      endShooting();
    } else {
      endShootingAndToggleTurn();
    }
  }, [
    endShooting,
    endShootingAndToggleTurn,
    opponentFleet,
    opponentMap,
    playerTargetCoordinates,
    setOpponentFleet,
    setOpponentMap,
  ]);

  const handleOpponentShoot = useCallback(async () => {
    let targetCoordinates: null | TCoordinates = null;

    // Opponent randomly selects a pair of coordinates after 2 seconds
    await delay(2000);
    targetCoordinates = getRandomCoordinate();
    setOpponentTargetCoordinates(targetCoordinates);

    // Then after 1 second starts firing
    await delay(1000);
    startsShooting();
  }, [setOpponentTargetCoordinates, startsShooting]);

  const handleOpponentFinishesShooting = useCallback(() => {
    if (!opponentTargetCoordinates.x || !opponentTargetCoordinates.y) return;

    const { fleet: newPlayerFleet, map: newPlayerMap } = attackMap(
      opponentTargetCoordinates as TCoordinates,
      playerMap,
      playerFleet,
    );
    setPlayerMap(newPlayerMap);
    setPlayerFleet(newPlayerFleet);

    if (isFleetDefeated(newPlayerFleet)) {
      endShooting();
    } else {
      endShootingAndToggleTurn();
    }
  }, [
    endShooting,
    endShootingAndToggleTurn,
    opponentTargetCoordinates,
    playerFleet,
    playerMap,
    setPlayerFleet,
    setPlayerMap,
  ]);

  const handleScrollInPage = useCallback(() => {
    if (isPlayerFleetDeployed && gamePhase === "start") return;

    const scrollY = window.scrollY;
    setScrollY(scrollY);
  }, [gamePhase, isPlayerFleetDeployed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollInPage);
    return () => {
      window.removeEventListener("scroll", handleScrollInPage);
    };
  }, [handleScrollInPage]);

  const handleResize = useCallback(() => {
    const tile = document.querySelector("." + tileCSS["BattleMap-tile"]);

    if (!domRoot || !tile) return;

    const tileSize = (tile as HTMLElement).offsetWidth;
    (domRoot as HTMLElement).style.setProperty("--tile-size", `${tileSize}px`);
  }, [domRoot]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Only first render
  useEffect(() => {
    setPlayerFleet([...commonFleetArr]);
  }, [commonFleetArr, setPlayerFleet]);

  // When prestart game for player action
  useEffect(() => {
    if (gamePhase !== "prestart") return;

    const { fleet, map } = autoFleetDeploy(COORDINATES_LENGTH, [...commonFleetArr], []);
    setOpponentMap(map);
    setOpponentFleet(fleet);
    setPlayerFleet([...commonFleetArr]);
  }, [commonFleetArr, gamePhase, setOpponentFleet, setOpponentMap, setPlayerFleet]);

  // Calculate winner
  useEffect(() => {
    if (!playerFleet.length || !opponentFleet.length) return;

    const isWinner = calculatePlayerIsWinner(playerFleet, opponentFleet);
    if (isWinner !== null && gamePhase === "start") {
      endGame();
      setPlayerWins(isWinner);
    }
  }, [endGame, gamePhase, opponentFleet, playerFleet, setPlayerWins]);

  // Manage opponent shooting
  useEffect(() => {
    if (gamePhase === "start" && !isPlayerTurn) {
      handleOpponentShoot();
    }
  }, [isPlayerTurn, gamePhase, handleOpponentShoot]);

  return (
    <>
      <section className={css["GamePage"]}>
        {isDesktopOrHigher ? (
          <>
            <FleetMenu.player className={css["GamePage-FleetPlayer"]} />
            <FleetMenu.opponent className={css["GamePage-FleetOpponent"]} />
            <div className={css["GamePage-BattleMapPlayer"]}>
              <BattleMap.player onFinishesShot={handleOpponentFinishesShooting} />
            </div>
            <div className={css["GamePage-BattleMapOpponent"]}>
              <BattleMap.opponent onFinishesShot={handlePlayerFinishesShot} />
            </div>
            <GuideBar className={css["GamePage-GuideBar"]} />
            <ActionBar className={css["GamePage-ActionBar"]} />
          </>
        ) : (
          <>
            <GuideBar className={css["GamePage-GuideBar"]} />
            <div className={css["GamePage-Container"]}>
              <FleetMenu.opponent className={css["GamePage-FleetOpponent"]} />
              <div className={css["GamePage-BattleMapOpponent"]}>
                <BattleMap.opponent onFinishesShot={handlePlayerFinishesShot} />
              </div>
              <div className={css["GamePage-BattleMapPlayer"]}>
                <BattleMap.player onFinishesShot={handleOpponentFinishesShooting} />
              </div>
              <FleetMenu.player className={css["GamePage-FleetPlayer"]} />
            </div>
            <ActionBar className={css["GamePage-ActionBar"]} />
          </>
        )}
      </section>
      {isPlayerWins !== null ? (
        <ResultsModal onRetryClick={restartGame} onToHomeClick={() => console.log("To home")} />
      ) : (
        <></>
      )}
      {cursorLocation && (
        <CursorShadowShip locationX={cursorLocation.left} locationY={cursorLocation.top + scrollY} />
      )}
    </>
  );
};
