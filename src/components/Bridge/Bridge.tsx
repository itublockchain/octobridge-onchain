import { Typography } from "ui";
import styles from "./Bridge.module.scss";
import { Modal } from "ui";
import {useModal} from 'hooks/useModal'
import { Script } from "vm";
import { IoMdMoon } from "react-icons/io";
import { IoIosArrowDown } from 'react-icons/io'

const Bridge = () => {
  const fromModal = useModal();
  return (
    <>
    <Modal isOpen={fromModal.isOpen} close={fromModal.close}>
          asdfasdfasddfs
        </Modal>
    <div className={styles.wrapper}>
      <div className={styles.bridgeWrapper}>
        <Typography variant="title3" weight="semibold">
          From: 
        </Typography>
        
        <div onClick={fromModal.open} className={styles.networkWrapper}>
        <IoMdMoon/>
          AVALANCHE
          <IoIosArrowDown/>
        </div>
      </div>
    </div>
    </>
  );
};

export { Bridge };
