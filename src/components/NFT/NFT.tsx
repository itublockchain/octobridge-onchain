import { NetworkModal } from "components/Bridge/Bridge";
import { useAccounts } from "hooks/useAccounts";
import { useApiRequest } from "hooks/useApiRequest";
import { useModal } from "hooks/useModal";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGetNetworks } from "services/request";
import { Button, Modal, Typography } from "ui";
import styles from "./NFT.module.scss";

const NFT = ({ item }: any) => {
  const [networks, setNetworks] = useState([]);
  const [network, setNetwork] = useState<any>(null);

  const networksReq = useApiRequest(apiGetNetworks, {
    onSuccess: (res: any) => {
      const arr: any = [];
      Object.keys(res.data).forEach((item) => {
        arr.push(res.data[item]);
      });
      setNetworks(arr);
      setNetwork(arr[0]);
    },
  });

  useEffect(() => {
    networksReq.exec();
  }, []);

  const modal = useModal();

  return (
    <>
      <Modal className={styles.modal} isOpen={modal.isOpen} close={modal.close}>
        <Typography weight="medium" variant="title4">
          Select the destination
        </Typography>
        <div className={styles.networks}>
          {networks.map((item: any) => (
            <Typography
              className={styles.networkEach}
              weight="medium"
              variant="body1"
            >
              {item?.name}
            </Typography>
          ))}
        </div>
      </Modal>
      <div key={item.id} className={styles.box}>
        <img className={styles.img} src={item.img} />
        <Button
          onClick={() => modal.open()}
          className={styles.button}
          variant="contained"
          size="m"
          color="secondary"
        >
          Transfer
        </Button>
      </div>
    </>
  );
};

export { NFT };
