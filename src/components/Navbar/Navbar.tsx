import { Button } from "ui";
import { Container } from "ui/Container/Container";
import styles from "./Navbar.module.scss";
import LogoRed from "assets/images/logo-red.png";
import LogoWhite from "assets/images/logo-white.png";
import Avax from "assets/images/avax.png";
import { useAccounts } from "hooks/useAccounts";
import { useRightNetwork } from "hooks/useRightNetwork";
import { useWalletConnection } from "hooks/useWalletConnection";
import { parseAddress } from "utils/parseAddress";
import { IoMdCard, IoMdMoon, IoMdPerson, IoMdSunny } from "react-icons/io";
import { useTheme } from "hooks/useTheme";
import { useMemo } from "react";
import { CHAINS } from "contract/chains";
import { NETWORK_IMAGE_MAP } from "contract/networks";
import Unknown from "assets/images/unknown.png";

const Navbar = () => {
  const { auth, address, chainId } = useAccounts();
  const { connectWallet } = useWalletConnection({
    autologin: false,
  });
  const { currentTheme, toggleTheme } = useTheme();

  const network = useMemo(() => {
    let network = null;
    for (let i = 0; i < CHAINS.length; i++) {
      const item = CHAINS[i];
      if (item.chainId == chainId) {
        network = item;
        break;
      }
    }
    return network;
  }, [chainId]);

  return (
    <Container maxWidth={1200} className={styles.wrapper}>
      <img
        src={currentTheme === "dark" ? LogoWhite : LogoRed}
        className={styles.logo}
      />
      <div className={styles.buttons}>
        {auth ? (
          <Button
            className={styles.networkButton}
            size="l"
            variant="contained"
            color="secondary"
          >
            <img
              src={NETWORK_IMAGE_MAP?.[network?.name] || Unknown}
              style={{ marginRight: "0.75rem" }}
              width={24}
              height={24}
            />
            {network?.name}
          </Button>
        ) : null}

        <Button
          className={styles.buttonEach}
          startIcon={auth ? <IoMdPerson /> : <IoMdCard />}
          onClick={connectWallet}
          size="l"
          variant="contained"
          color="danger"
        >
          {!auth ? "Connect Wallet" : parseAddress(address)}
        </Button>
        <Button
          onClick={toggleTheme}
          size="l"
          color="secondary"
          variant="contained"
          endIcon={currentTheme === "dark" ? <IoMdMoon /> : <IoMdSunny />}
        />
      </div>
    </Container>
  );
};

export { Navbar };
