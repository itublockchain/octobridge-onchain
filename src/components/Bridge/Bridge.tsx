import { Button, Icon, Typography } from "ui";
import styles from "./Bridge.module.scss";
import { Modal } from "ui";
import { useModal } from "hooks/useModal";
import { IoIosArrowDown } from "react-icons/io";
import Avax from "assets/images/avax.png";
import { useState } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";
import { TOKENS } from "contract/tokenList";
import { NETWORKS } from "contract/networks";

const Bridge = () => {
  const fromModal = useModal();
  const networkFromModal = useModal();
  const [tokenIn, setTokenIn] = useState(TOKENS[0]);
  const [amountIn, setAmountIn] = useState("");

  return (
    <>
      <Modal
        disableCloseButton
        className={styles.modal}
        isOpen={networkFromModal.isOpen}
        close={networkFromModal.close}
      >
        <Typography
          className={styles.header}
          variant="title3"
          weight="semibold"
        >
          Select a Token
        </Typography>
        <div className={styles.tokenWrapper}>
          {NETWORKS.map((item) => (
            <div className={styles.item}>
              <Typography
                className={styles.itemInner}
                as="p"
                variant="body1"
                weight="regular"
              >
                {item.chainName}
              </Typography>
              <Typography
                className={styles.itemInner}
                as="p"
                variant="body1"
                weight="regular"
              >
                {item.chainId}
              </Typography>
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        disableCloseButton
        className={styles.modal}
        isOpen={fromModal.isOpen}
        close={fromModal.close}
      >
        <Typography
          className={styles.header}
          variant="title3"
          weight="semibold"
        >
          Select a Token
        </Typography>
        <div className={styles.tokenWrapper}>
          {TOKENS.map((item) => (
            <div className={styles.item}>
              <img
                width={32}
                height={32}
                className={styles.itemImage}
                src={item.logoURI}
              />
              <Typography
                className={styles.itemInner}
                as="p"
                variant="body1"
                weight="regular"
              >
                {item.name}
              </Typography>
            </div>
          ))}
        </div>
      </Modal>
      <div className={styles.wrapper}>
        <div className={styles.bridgeWrapper}>
          <div className={styles.data}>
            <Typography variant="title4" weight="semibold">
              From
            </Typography>
            <div onClick={fromModal.open} className={styles.networkWrapper}>
              <div className={styles.inner}>
                <img
                  style={{ marginRight: "0.8rem" }}
                  src={Avax}
                  height={32}
                  width={32}
                />
                <Typography variant="title4" weight="semibold">
                  AVALANCHE
                </Typography>
              </div>
              <Icon className={styles.icon}>
                <IoIosArrowDown fontSize={24} />
              </Icon>
            </div>
            <div className={styles.inputWrapper}>
              <input
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                className={styles.input}
                placeholder={"Enter Amount"}
              />
            </div>
          </div>

          <Icon className={styles.exchange}>
            <CgArrowsExchangeV fontSize={28} />
          </Icon>

          <div className={styles.data}>
            <Typography variant="title4" weight="semibold">
              To
            </Typography>
            <div onClick={fromModal.open} className={styles.networkWrapper}>
              <div className={styles.inner}>
                <img
                  style={{ marginRight: "0.8rem" }}
                  src={Avax}
                  height={32}
                  width={32}
                />
                <Typography variant="title4" weight="semibold">
                  AVALANCHE
                </Typography>
              </div>
              <Icon className={styles.icon}>
                <IoIosArrowDown fontSize={24} />
              </Icon>
            </div>
            <div className={styles.inputWrapper}>
              <input
                value={amountIn}
                readOnly
                className={styles.input}
                placeholder={"Output Amount"}
              />
            </div>
          </div>

          <Button style={{ marginTop: "32px" }} size="xl" color="danger">
            Transfer
          </Button>
        </div>
      </div>
    </>
  );
};

export { Bridge };
