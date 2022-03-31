import { Button, Icon, Typography } from "ui";
import styles from "./Bridge.module.scss";
import { Modal } from "ui";
import { useModal } from "hooks/useModal";
import { IoIosArrowDown } from "react-icons/io";
import Unknown from "assets/images/unknown.png";
import { useEffect, useState } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";
import { TOKENS } from "contract/tokenList";
import { NETWORKS, NETWORK_IMAGE_MAP } from "contract/networks";
import { clsnm } from "utils/clsnm";
import ARML1 from "assets/images/arms/l1.png";
import ARML2 from "assets/images/arms/l2.png";
import ARML3 from "assets/images/arms/l3.png";
import ARML4 from "assets/images/arms/l4.png";
import ARMR1 from "assets/images/arms/r1.png";
import ARMR2 from "assets/images/arms/r2.png";
import ARMR3 from "assets/images/arms/r3.png";
import ARMR4 from "assets/images/arms/r4.png";
import { useApiRequest } from "hooks/useApiRequest";
import { ethers } from "ethers";
import { MaxUint256 } from "@ethersproject/constants";
import { useAccounts } from "hooks/useAccounts";
import { toast } from "react-toastify";
import Head from "assets/images/head/head.png";
import LeftEye from "assets/images/head/left_eye_black.png";
import RightEye from "assets/images/head/right_eye_black.png";
import { formatEther, parseEther } from "ethers/lib/utils";
import { requestChain } from "utils/requestChain";
import { isZero } from "utils/isZero";
import { DEPLOYMENTS } from "contract/deployments";
import { LAYER_ZERO } from "contract/abi/layerZero";
import { OCTOBRIDGE20 } from "contract/abi/octobridge20";

const regexp = /^-?\d*\.?\d*$/;

const Bridge = () => {
  const tokenFromModal = useModal();
  const tokenOutModal = useModal();
  const networkFromModal = useModal();
  const networkOutModal = useModal();
  const [tokenIn, setTokenIn] = useState<any>({});
  const [tokenOut, setTokenOut] = useState<any>({});
  const [amountIn, setAmountIn] = useState("");
  const [networkIn, setNetworkIn] = useState<any>({});
  const [networkOut, setNetworkOut] = useState<any>({});
  const [focused, setFocused] = useState(false);
  const [networks, setNetworks] = useState([]);
  const { signer, auth, address, chainId, provider } = useAccounts();
  const [isClaimable, setIsClaimable] = useState(false);
  const [time, setTime] = useState(0);
  const [hide, setHide] = useState(false);

  const [claims, setClaims] = useState<any>([]);

  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  const [tokensIn, setTokensIn] = useState([]);
  const [tokensOut, setTokensOut] = useState([]);

  /*   const networksReq = useApiRequest(apiGetNetworks, {
    onSuccess: (res: any) => {
      const arr: any = [];
      Object.keys(res.data).forEach((item) => {
        arr.push(res.data[item]);
      });
      setNetworks(arr);
      setNetworkIn(arr.filter((item: any) => item.networkId === 43113)[0]);
      setNetworkOut(arr.filter((item: any) => item.networkId === 80001)[0]);
    },
  }); */

  /* const tokenReq = useApiRequest(
    (params: any, direction) => apiGetTokens(params),
    {
      onSuccess: (res: any, params, direction) => {
        if (direction === "in") {
          if (res.data?.length > 0) {
            setTokensIn(res.data);
            setTokenIn(res.data[0]);
          } else {
            setTokensIn([]);
            setTokenIn({});
          }
        } else {
          if (res.data.length > 0) {
            setTokensOut(res.data);
            setTokenOut(res.data[0]);
          } else {
            setTokenOut(TOKENS[0]);
            setTokensOut([TOKENS[0]]);
          }
        }
      },
    }
  ); */

  useEffect(() => {
    try {
      const arr: any = [];
      Object.keys(NETWORKS).forEach((item) => {
        arr.push(NETWORKS[item]);
      });
      setNetworks(arr);
      setNetworkIn(arr.filter((item: any) => item.networkId === 43113)[0]);
      setNetworkOut(arr.filter((item: any) => item.networkId === 80001)[0]);
    } catch {}
  }, [auth]);

  useEffect(() => {
    try {
      if ("networkId" in networkIn) {
        if (networkIn?.networkId === 43113) {
          setTokenIn(TOKENS[0]);
          setTokensIn(TOKENS);
        } else {
          setTokenIn({});
          setTokensIn([]);
        }
        //tokenReq.exec({ networkId: networkIn.networkId }, "in");
      }
    } catch {}
  }, [networkIn, auth, chainId]);

  useEffect(() => {
    if (!auth) {
      return;
    }
    const fetch = async () => {
      const LAYER_ZERO_CONTRACT = new ethers.Contract(
        DEPLOYMENTS[chainId].layerZeroAddress,
        LAYER_ZERO,
        provider
      );

      const res = await LAYER_ZERO_CONTRACT.txs(address);

      if (!isZero(res.amount)) {
        setIsClaimable(true);
      } else {
        setIsClaimable(false);
      }
    };
    fetch();
  }, [provider, chainId]);

  useEffect(() => {
    if (!auth || !chainId || !provider) {
      return;
    }

    const timer = setTimeout(() => {
      const fetch = async () => {
        const LAYER_ZERO_CONTRACT = new ethers.Contract(
          DEPLOYMENTS[chainId].layerZeroAddress,
          LAYER_ZERO,
          provider
        );
        console.log("fetched");

        const res = await LAYER_ZERO_CONTRACT.txs(address);

        if (!isZero(res.amount)) {
          setIsClaimable(true);
        } else {
          setIsClaimable(false);
        }
      };
      fetch();
      setTime(time + 1);
    }, 5000);
    return () => clearTimeout(timer);
  }, [auth, chainId, provider, time]);

  const lock = async () => {
    if (!auth || !tokenIn.address || !networkIn.networkId || !chainId) {
      return;
    }
    try {
      setLoading(true);

      const OCTOBRIDGE20_CONTRACT = new ethers.Contract(
        DEPLOYMENTS[chainId].erc20BridgeAddress,
        OCTOBRIDGE20,
        provider
      );

      const tokens = await OCTOBRIDGE20_CONTRACT?.tokens(tokenIn.address);
      let originChain = tokens[0];
      let originAddress = tokens[1];

      if (originChain == 0) {
        originChain = networkIn?.layerZero?.id;
      }
      if (isZero(originAddress)) {
        originAddress = tokenIn.address;
      }

      const tokenAddr = tokenIn?.address;
      const tokenAbi = [
        "function approve(address _spender, uint256 _value) public returns (bool success)",
        "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
      ];
      const TOKEN_CONTRACT = new ethers.Contract(tokenAddr, tokenAbi);

      const allowanceRes = await TOKEN_CONTRACT.connect(signer).allowance(
        address,
        DEPLOYMENTS[chainId].erc20BridgeAddress
      );

      if (Number(formatEther(allowanceRes)) < Number(amountIn)) {
        const approveTxn = await TOKEN_CONTRACT.connect(signer).approve(
          DEPLOYMENTS[chainId].erc20BridgeAddress,
          MaxUint256
        );
        await approveTxn.wait();
      }

      const txn = await OCTOBRIDGE20_CONTRACT?.connect(signer).lock(
        originChain,
        networkOut?.layerZero?.id,
        networkOut?.layerZero?.id,
        tokenIn.address,
        parseEther(amountIn),
        DEPLOYMENTS[networkOut.networkId]?.layerZeroAddress,
        { value: parseEther("0.5") }
      );
      await txn.wait();
      toast("Transfer is successful");
      setLoading(false);
      setAmountIn("");
    } catch (err) {
      toast("Transaction failed");
      console.log(err);
    }
  };

  const claim = async () => {
    try {
      setClaimLoading(true);
      const OCTOBRIDGE20_CONTRACT = new ethers.Contract(
        DEPLOYMENTS[chainId].erc20BridgeAddress,
        OCTOBRIDGE20,
        provider
      );
      const txn = await OCTOBRIDGE20_CONTRACT.connect(signer).claim();
      await txn.wait();
      setClaimLoading(false);
    } catch (err) {
      toast("Transaction failed");
      setClaimLoading(false);
    }
  };
  return (
    <>
      <NetworkModal
        isOpen={networkFromModal.isOpen}
        close={networkFromModal.close}
        onClick={(item: any) => {
          networkFromModal.close();
          setNetworkIn(item);
        }}
        items={networks.filter(
          (item: any) => item?.networkId !== networkOut?.networkId
        )}
      />
      <NetworkModal
        isOpen={networkOutModal.isOpen}
        close={networkOutModal.close}
        onClick={(item: any) => {
          networkOutModal.close();
          setNetworkOut(item);
        }}
        items={networks.filter(
          (item: any) => item.networkId !== networkIn?.networkId
        )}
      />
      <TokenModal
        isOpen={tokenFromModal.isOpen}
        close={tokenFromModal.close}
        onClick={(item: any) => {
          tokenFromModal.close();
          setTokenIn(item);
        }}
        items={tokensIn?.length > 0 ? tokensIn : [TOKENS[0]]}
      />
      <TokenModal
        isOpen={tokenOutModal.isOpen}
        close={tokenOutModal.close}
        onClick={(item: any) => {
          tokenOutModal.close();
          setTokenOut(item);
        }}
        items={tokensOut?.length > 0 ? tokensOut : [TOKENS[0]]}
      />
      <div className={styles.wrapper}>
        <div className={clsnm(styles.headWrapper, styles.loading)}>
          <img className={styles.head} src={Head} />
          <img className={styles.leftEye} src={LeftEye} />
          <img className={styles.rightEye} src={RightEye} />
        </div>
        <img src={ARML1} className={styles.l1} />
        <img src={ARML2} className={styles.l2} />
        <img src={ARML3} className={styles.l3} />
        <img src={ARML4} className={styles.l4} />
        <img src={ARMR1} className={styles.r1} />
        <img src={ARMR2} className={styles.r2} />
        <img src={ARMR3} className={styles.r3} />
        <img src={ARMR4} className={styles.r4} />
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
                  src={
                    networkIn?.logo ||
                    NETWORK_IMAGE_MAP[networkIn?.name] ||
                    Unknown
                  }
                  height={32}
                  width={32}
                />
                <Typography variant="title4" weight="semibold">
                  {networkIn?.name}
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
                onChange={(e) => {
                  if (
                    !regexp.test(e.target.value) ||
                    e.target.value.includes("-")
                  ) {
                    return;
                  }
                  setAmountIn(e.target.value);
                }}
                className={styles.input}
                placeholder={"Enter Amount"}
              />
              {tokensIn.length > 0 && (
                <div
                  onClick={tokenFromModal.open}
                  className={styles.tokenController}
                >
                  <img
                    width={24}
                    height={24}
                    style={{ marginRight: "0.5rem", borderRadius: "50%" }}
                    src={tokenIn?.logoURI || Unknown}
                  />
                  {tokenIn.symbol}
                  <Icon>
                    <IoIosArrowDown />
                  </Icon>
                </div>
              )}
            </div>
          </div>

          <Icon
            className={clsnm(
              styles.exchange,
              (loading || claimLoading) && styles.loading
            )}
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
                  src={
                    networkOut?.logo ||
                    NETWORK_IMAGE_MAP[networkOut?.name] ||
                    Unknown
                  }
                  height={32}
                  width={32}
                />
                <Typography variant="title4" weight="semibold">
                  {networkOut?.name}
                </Typography>
              </div>
              <Icon className={styles.icon}>
                <IoIosArrowDown fontSize={24} />
              </Icon>
            </div>
            <div className={styles.inputWrapper}>
              <input
                style={{ opacity: "0.2" }}
                value={amountIn}
                readOnly
                className={styles.input}
                placeholder={"Output Amount"}
              />
              <div className={styles.tokenController}>
                <img
                  width={24}
                  height={24}
                  style={{ marginRight: "0.5rem", borderRadius: "50%" }}
                  src={tokenIn?.logoURI || Unknown}
                />
                {tokenIn?.symbol}
              </div>
            </div>
          </div>
          <Button
            loading={loading}
            onClick={async () => await lock()}
            disabled={
              tokensIn?.length <= 0 ||
              !auth ||
              claims?.length > 0 ||
              chainId !== networkIn?.networkId ||
              !amountIn
            }
            style={{ marginTop: "32px" }}
            size="xl"
            color="danger"
          >
            Transfer
          </Button>
          {isClaimable && (
            <Button
              loading={claimLoading}
              onClick={async () => await claim()}
              disabled={!auth}
              style={{ marginTop: "12px" }}
              size="xl"
              color="danger"
            >
              Claim
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export const NetworkModal = ({ isOpen, close, items, onClick }: any) => {
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
        {items.map((item: any, index: number) => (
          <div
            key={index}
            onClick={() => onClick(item)}
            className={styles.networkItem}
          >
            <Typography
              className={styles.itemInner}
              as="p"
              variant="title4"
              weight="regular"
            >
              {item.name}
            </Typography>
            <Typography
              className={styles.itemInner}
              as="p"
              variant="body2"
              weight="regular"
            >
              Network ID: {item.networkId}
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
              src={item.logoURI || Unknown}
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
