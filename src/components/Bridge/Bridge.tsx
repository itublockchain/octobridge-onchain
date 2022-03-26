import { Button, Icon, Typography } from "ui";
import styles from "./Bridge.module.scss";
import { Modal } from "ui";
import { useModal } from "hooks/useModal";
import { IoIosArrowDown } from "react-icons/io";
import Avax from "assets/images/avax.png";
import Unknown from "assets/images/unknown.png";
import { useState } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";
import { TOKENS } from "contract/tokenList";
import { NETWORKS } from "contract/networks";
import { clsnm } from "utils/clsnm";

const Bridge = () => {
  const tokenFromModal = useModal();
  const tokenOutModal = useModal();
  const networkFromModal = useModal();
  const networkOutModal = useModal();
  const [tokenIn, setTokenIn] = useState(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState(TOKENS[0]);
  const [amountIn, setAmountIn] = useState("");
  const [networkIn, setNetworkIn] = useState(NETWORKS[0]);
  const [networkOut, setNetworkOut] = useState(NETWORKS[1]);

  const [focused, setFocused] = useState(false);

  return (
    <>
      <NetworkModal
        isOpen={networkFromModal.isOpen}
        close={networkFromModal.close}
        onClick={(item: any) => {
          networkFromModal.close();
          setNetworkIn(item);
        }}
        items={NETWORKS.filter((item) => item.chainId !== networkOut.chainId)}
      />
      <NetworkModal
        isOpen={networkOutModal.isOpen}
        close={networkOutModal.close}
        onClick={(item: any) => {
          networkOutModal.close();
          setNetworkOut(item);
        }}
        items={NETWORKS.filter((item) => item.chainId !== networkIn.chainId)}
      />
      <TokenModal
        isOpen={tokenFromModal.isOpen}
        close={tokenFromModal.close}
        onClick={(item: any) => {
          tokenFromModal.close();
          setTokenIn(item);
        }}
        items={TOKENS}
      />
      <TokenModal
        isOpen={tokenOutModal.isOpen}
        close={tokenOutModal.close}
        onClick={(item: any) => {
          tokenOutModal.close();
          setTokenOut(item);
        }}
        items={TOKENS}
      />
      <div className={styles.wrapper}>
        <div className={styles.bridgeWrapper}>
          <div className={styles.data}>
            <Typography variant="title4" weight="semibold">
              From
            </Typography>
            <div
              onClick={networkFromModal.open}
              className={styles.networkWrapper}
            >
              <div className={styles.inner}>
                <img
                  style={{ marginRight: "0.8rem", borderRadius: "50%" }}
                  src={networkIn.logo || Unknown}
                  height={32}
                  width={32}
                />
                <Typography variant="title4" weight="semibold">
                  {networkIn.chainName}
                </Typography>
              </div>
              <Icon className={styles.icon}>
                <IoIosArrowDown fontSize={24} />
              </Icon>
            </div>
            <div
              className={clsnm(styles.inputWrapper, focused && styles.focus)}
            >
              <input
                onFocus={() => {
                  setFocused(true);
                }}
                onBlur={() => {
                  setFocused(false);
                }}
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                className={styles.input}
                placeholder={"Enter Amount"}
              />
              <div
                onClick={tokenFromModal.open}
                className={styles.tokenController}
              >
                <img
                  width={24}
                  height={24}
                  style={{ marginRight: "0.5rem", borderRadius: "50%" }}
                  src={tokenIn.logoURI}
                />
                {tokenIn.symbol}
                <Icon>
                  <IoIosArrowDown />
                </Icon>
              </div>
            </div>
          </div>

          <Icon
            className={styles.exchange}
            onClick={() => {
              const temp = networkIn;
              setNetworkIn(networkOut);
              setNetworkOut(temp);
            }}
          >
            <CgArrowsExchangeV fontSize={28} />
          </Icon>

          <div className={styles.data}>
            <Typography variant="title4" weight="semibold">
              To
            </Typography>
            <div
              onClick={networkOutModal.open}
              className={styles.networkWrapper}
            >
              <div className={styles.inner}>
                <img
                  style={{ marginRight: "0.8rem", borderRadius: "50%" }}
                  src={networkOut.logo || Unknown}
                  height={32}
                  width={32}
                />
                <Typography variant="title4" weight="semibold">
                  {networkOut.chainName}
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
              <div
                onClick={tokenOutModal.open}
                className={styles.tokenController}
              >
                <img
                  width={24}
                  height={24}
                  style={{ marginRight: "0.5rem", borderRadius: "50%" }}
                  src={tokenOut.logoURI}
                />
                {tokenOut.symbol}
                <Icon>
                  <IoIosArrowDown />
                </Icon>
              </div>
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

const NetworkModal = ({ isOpen, close, items, onClick }: any) => {
  return (
    <Modal
      disableCloseButton
      className={styles.modal}
      isOpen={isOpen}
      close={close}
    >
      <Typography className={styles.header} variant="title3" weight="semibold">
        Select network
      </Typography>
      <div className={styles.tokenWrapper}>
        {items.map((item: any) => (
          <div onClick={() => onClick(item)} className={styles.networkItem}>
            <Typography
              className={styles.itemInner}
              as="p"
              variant="title4"
              weight="regular"
            >
              {item.chainName}
            </Typography>
            <Typography
              className={styles.itemInner}
              as="p"
              variant="body2"
              weight="regular"
            >
              Chain ID: {item.chainId}
            </Typography>
          </div>
        ))}
      </div>
    </Modal>
  );
};

const TokenModal = ({ isOpen, close, items, onClick }: any) => {
  return (
    <Modal
      disableCloseButton
      className={styles.modal}
      isOpen={isOpen}
      close={close}
    >
      <Typography className={styles.header} variant="title3" weight="semibold">
        Select a Token
      </Typography>
      <div className={styles.tokenWrapper}>
        {items.map((item: any) => (
          <div onClick={() => onClick(item)} className={styles.item}>
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
  );
};

export { Bridge };
