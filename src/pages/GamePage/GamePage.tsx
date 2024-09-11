import { FleetMenu } from '~/components/FleetInfoCard';
import styles from './GamePage.module.css';
import { type TShipNameKeys } from '~/types/game';

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
      <div>
        DESPLIEGA TU FLOTA
      </div>
      <div>
        DESPLIEGA TU FLOTA
      </div>
    </section>
  )
}