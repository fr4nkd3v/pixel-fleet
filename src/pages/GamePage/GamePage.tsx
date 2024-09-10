import { FleetMenu } from '../../components/FleetInfoCard';
import styles from './GamePage.module.css';

export const GamePage = () => {
  return (
    <section className={styles['GamePage']}>
      <FleetMenu />
      <div>
        DESPLIEGA TU FLOTA
      </div>
      <div>
        DESPLIEGA TU FLOTA
      </div>
      <div>
        DESPLIEGA TU FLOTA
      </div>
    </section>
  )
}