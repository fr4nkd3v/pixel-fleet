import { useCallback, useEffect, useMemo, useState } from "react";
import css from "./game-page.module.css";
import {
  FleetMenu,
  BattleMap,
  CursorShadowShip,
  ResultsModal,
  GuideBar,
  ActionBar,
} from "~/components";
import { TCursorLocation, TCoordinate } from "~/types/game";
import { AVAILABLE_FLEET_IDS, MAP_SIZE } from "~/constants/game";
import {
  attackMap,
  autoFleetDeploy,
  getRandomCoordinate,
  calculatePlayerIsWinner,
  prepareFleet,
  isFleetDefeated,
  delay,
} from "~/utils";
import {
  useGameStore,
  useOpponentStore,
  usePlayerStore,
  useShipDeployStore,
} from "~/stores";
import { useBreakpoints } from "~/hooks";

export const GamePage = () => {
  // Set fleet & map size for each player

  // Generate fleet & map data for state
  const commonFleetArr = useMemo(() => prepareFleet(AVAILABLE_FLEET_IDS), []);

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

  const domRoot = useMemo(() => document.querySelector(":root"), []);

  const [cursorLocation, setCursorLocation] = useState<TCursorLocation | null>(
    null
  );
  const [scrollY, setScrollY] = useState(0);

  const isPlayerFleetDeployed = playerFleet.every((ship) => ship.isDeployed);

  const restartGame = useCallback(() => {
    restartGameState();
    restartOpponentState();
    restartPlayerState();
    restartShipDeployState();
  }, [
    restartGameState,
    restartOpponentState,
    restartPlayerState,
    restartShipDeployState,
  ]);

  const handlePlayerFinishesShot = useCallback(() => {
    if (!playerTargetCoordinates.x || !playerTargetCoordinates.y) return;

    const { fleet: newOpponentFleet, map: newOpponentMap } = attackMap(
      playerTargetCoordinates as TCoordinate,
      opponentMap,
      opponentFleet
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
    let targetCoordinates: null | TCoordinate = null;

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
      opponentTargetCoordinates as TCoordinate,
      playerMap,
      playerFleet
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

  const handleMouseMoveInPage = (event: React.MouseEvent) => {
    if (isPlayerFleetDeployed) return;

    const { clientX, clientY } = event;
    const verticalScrollLength = document.scrollingElement?.scrollTop ?? 0;
    setCursorLocation({
      left: clientX,
      top: clientY,
    });
    setScrollY(verticalScrollLength);
  };

  const handleScrollInPage = useCallback(() => {
    if (isPlayerFleetDeployed) return;

    const scrollY = window.scrollY;
    setScrollY(scrollY);
  }, [isPlayerFleetDeployed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollInPage);
    return () => {
      window.removeEventListener("scroll", handleScrollInPage);
    };
  }, [handleScrollInPage]);

  const handleResize = useCallback(() => {
    const tile = document.getElementById("first-tile");
    if (domRoot && tile) {
      (domRoot as HTMLElement).style.setProperty(
        "--tile-size",
        `${tile.offsetWidth}px`
      );
    }
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

    const { fleet, map } = autoFleetDeploy(MAP_SIZE, [...commonFleetArr], []);
    setOpponentMap(map);
    setOpponentFleet(fleet);
    setPlayerFleet([...commonFleetArr]);
  }, [
    commonFleetArr,
    gamePhase,
    setOpponentFleet,
    setOpponentMap,
    setPlayerFleet,
  ]);

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
      <section className={css["GamePage"]} onMouseMove={handleMouseMoveInPage}>
        {isDesktopOrHigher ? (
          <>
            <FleetMenu
              perspective="player"
              className={css["GamePage-FleetPlayer"]}
              setCursorLocation={setCursorLocation}
            />
            <FleetMenu
              perspective="opponent"
              className={css["GamePage-FleetOpponent"]}
            />
            <div className={css["GamePage-BattleMapPlayer"]}>
              <BattleMap
                perspective="player"
                onFinishesShot={handleOpponentFinishesShooting}
              />
            </div>
            <div className={css["GamePage-BattleMapOpponent"]}>
              <BattleMap
                perspective="opponent"
                onFinishesShot={handlePlayerFinishesShot}
              />
            </div>
            <GuideBar className={css["GamePage-GuideBar"]} />
            <ActionBar className={css["GamePage-ActionBar"]} />
          </>
        ) : (
          <>
            <GuideBar className={css["GamePage-GuideBar"]} />
            <div className={css["GamePage-Container"]}>
              <FleetMenu
                perspective="opponent"
                className={css["GamePage-FleetOpponent"]}
              />
              <div className={css["GamePage-BattleMapOpponent"]}>
                <BattleMap
                  perspective="opponent"
                  onFinishesShot={handlePlayerFinishesShot}
                />
              </div>
              <div className={css["GamePage-BattleMapPlayer"]}>
                <BattleMap
                  perspective="player"
                  onFinishesShot={handleOpponentFinishesShooting}
                />
              </div>
              <FleetMenu
                perspective="player"
                className={css["GamePage-FleetPlayer"]}
                setCursorLocation={setCursorLocation}
              />
            </div>
            <ActionBar className={css["GamePage-ActionBar"]} />
          </>
        )}
      </section>
      {isPlayerWins !== null ? (
        <ResultsModal
          onRetryClick={restartGame}
          onToHomeClick={() => console.log("To home")}
        />
      ) : (
        <></>
      )}
      {cursorLocation && (
        <CursorShadowShip
          locationX={cursorLocation.left}
          locationY={cursorLocation.top + scrollY}
        />
      )}
    </>
  );
};
