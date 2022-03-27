import { Navbar, NFT } from "components";
import styles from "./NftBridge.module.scss";
import NFT1 from "assets/nfts/1.png";
import NFT2 from "assets/nfts/2.png";
import NFT3 from "assets/nfts/3.png";
import { Button, Container, Typography } from "ui";
import { useAccounts } from "hooks/useAccounts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NFTS = [
  {
    id: "1",
    img: NFT1,
  },
  {
    id: "2",
    img: NFT2,
  },
  {
    id: "3",
    img: NFT3,
  },
];

const NftBridge = () => {
  const { auth } = useAccounts();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/");
      toast("You have not connected to wallet");
    }
  }, [auth]);

  return (
    <div className="app">
      <Navbar />
      <Container className={styles.margin} maxWidth={1200}>
        <Typography variant="title1" weight="semibold">
          My NFTS
        </Typography>
        <div className={styles.grid}>
          {NFTS.map((item) => (
            <NFT key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export { NftBridge };
