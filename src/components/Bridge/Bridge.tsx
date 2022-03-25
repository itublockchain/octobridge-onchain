import { Typography } from "ui";
import styles from "./Bridge.module.scss";

const Bridge = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bridgeWrapper}>
        <Typography variant="title3" weight="semibold">
          From:
        </Typography>
      </div>
    </div>
  );
};

export { Bridge };
