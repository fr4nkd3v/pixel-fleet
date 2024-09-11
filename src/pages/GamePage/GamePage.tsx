import { FleetMenu } from '~/components/FleetInfoCard';
import styles from './GamePage.module.css';
import { type TShipNameKeys } from '~/types/game';
import { BattleMap } from '~/components/BattleMap';

export const GamePage = () => {
  const fleet: TShipNameKeys[] = [
    'missile_launcher',
    'destroyer',
    'battleship',
    'submarine',
  ];

  return (
    <section className={styles['GamePage']}>
      <FleetMenu shipList={fleet} />
      <FleetMenu shipList={fleet} />
      <BattleMap width={10} height={10} />
      <div>
        DESPLIEGA TU FLOTA
      </div>
    </section>
  )
}