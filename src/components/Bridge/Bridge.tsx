import { Button, Icon, Typography } from "ui";
import styles from "./Bridge.module.scss";
import { Modal } from "ui";
import { useModal } from "hooks/useModal";
import { IoIosArrowDown } from "react-icons/io";
import Unknown from "assets/images/unknown.png";
import { useEffect, useState } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";
import { TOKENS } from "contract/tokenList";
import { NETWORK_IMAGE_MAP } from "contract/networks";
import { clsnm } from "utils/clsnm";
import {
  apiGetNetworks,
  apiGetTokens,
  apiRegisterToken,
  apiSubmitTxn,
} from "services/request";
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
import { Claims } from "utils/claims";
import Head from "assets/images/head/head.png";
import LeftEye from "assets/images/head/left_eye_black.png";
import RightEye from "assets/images/head/right_eye_black.png";
import { formatEther } from "ethers/lib/utils";
import { checkIfRightNetwork } from "utils/checkIfRightNetwork";
import { requestChain } from "utils/requestChain";
import { IS_PROD } from "utils/isProd";

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
  const { signer, auth, address, chainId } = useAccounts();

  const [claims, setClaims] = useState<any>([]);

  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  const [tokensIn, setTokensIn] = useState([]);
  const [tokensOut, setTokensOut] = useState([]);

  const networksReq = useApiRequest(apiGetNetworks, {
    onSuccess: (res: any) => {
      const arr: any = [];
      Object.keys(res.data).forEach((item) => {
        arr.push(res.data[item]);
      });
      setNetworks(arr);
      setNetworkIn(arr[0]);
      setNetworkOut(arr[1]);
    },
  });

  const tokenReq = useApiRequest(
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
  );

  useEffect(() => {
    try {
      networksReq.exec();
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if ("networkId" in networkIn) {
        tokenReq.exec({ networkId: networkIn.networkId }, "in");
        if (auth) {
          requestChain(networkIn?.networkId);
        }
      }
    } catch {}
  }, [networkIn]);

  useEffect(() => {
    try {
      if ("networkId" in networkOut) {
        tokenReq.exec({ networkId: networkOut?.networkId }, "out");
      }
    } catch {}
  }, [networkOut]);

  const submitTxnReq = useApiRequest((data, _amount) => apiSubmitTxn(data), {
    onSuccess: (res, data, _amount) => {
      const claim = new Claims(
        tokenIn?.originNetworkId,
        networkIn?.networkId,
        tokenIn?.address,
        _amount,
        res.data?.signedMessage,
        res.data?.tokenName,
        res.data?.tokenSymbol,
        res.data?.nonce,
        tokenIn?.originNetworkId,
        tokenIn?.address,
        networkOut?.networkId,
        tokenIn?.originNetworkId,
        networkOut?.networkId,
        networkOut?.bridge
      );
      setClaims([...claims, claim]);
      setLoading(false);
      toast("You transaction is signed");
    },
    onFail: () => {
      toast("You transaction is rejected");
      setLoading(false);
    },
  });

  const registerTokenReq = useApiRequest((data) => apiRegisterToken(data), {
    onSuccess: (res) => {
      toast("Token added successfully");
      networksReq.exec();
    },
  });

  const lock = async () => {
    if (!("networkId" in networkIn) && tokenIn?.address) {
      return;
    }
    setLoading(true);
    let _amount = amountIn;
    try {
      const tokenAddr = tokenIn?.address;
      const tokenAbi = [
        "function approve(address _spender, uint256 _value) public returns (bool success)",
        "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
      ];

      const TOKEN_CONTRACT = new ethers.Contract(tokenAddr, tokenAbi);

      const addr = networkIn?.bridge;
      const abi = [
        "function lock(uint16 _mainChain, uint16 _destination, address _tokenAddress,uint256 _amount)",
      ];

      const allowanceRes = await TOKEN_CONTRACT.connect(signer).allowance(
        address,
        addr
      );

      if (Number(formatEther(allowanceRes)) < Number(_amount)) {
        const approveTxn = await TOKEN_CONTRACT.connect(signer).approve(
          addr,
          MaxUint256
        );
        await approveTxn.wait();
      }

      const BRIDGE_CONTRACT = new ethers.Contract(addr, abi);
      const txn = await BRIDGE_CONTRACT.connect(signer).lock(
        networkIn.networkId,
        networkOut.networkId,
        tokenIn.address,
        ethers.utils.parseEther(_amount)
      );
      await txn.wait();
      submitTxnReq.exec(
        {
          txId: txn?.hash,
          networkId: networkIn?.networkId,
        },
        _amount
      );
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const claim = async () => {
    try {
      const claim = claims[0];
      const addr = claim?._claimContractAddr;
      const abi = [
        "function claim(uint16 _mainChain, uint256 _nonce, uint16 _midChain, address _mainAddress, uint256 _amount,bytes memory _signature,string memory _name,string memory _symbol)",
      ];
      const BRIDGE_CONTRACT = new ethers.Contract(addr, abi);
      setClaimLoading(true);
      if (!IS_PROD) {
        console.log([
          claim._mainChain,
          claim._nonce,
          claim._midChain,
          tokenIn?.address,
          ethers.utils.parseEther(claim._amount),
          claim._signature,
          claim._name,
          claim._symbol,
        ]);
      }
      const txn = await BRIDGE_CONTRACT.connect(signer).claim(
        claim._mainChain,
        claim._nonce,
        claim._midChain,
        chainId !== 43113 ? claim._mainAddress : tokenIn?.address,
        ethers.utils.parseEther(claim._amount),
        claim._signature,
        claim._name,
        claim._symbol
      );
      await txn.wait();
      toast("Claimed successfully!");
      registerTokenReq.exec({
        originNetworkId: claim._originNetworkId,
        originTokenAddress: claim._originTokenAddress,
        currentNetworkId: claim._currentNetworkId,
      });
      const newClaims = [];
      for (let i = 1; i < claims.length; i++) {
        newClaims.push(claims[i]);
      }
      setClaims(newClaims);
      setClaimLoading(false);
    } catch (err) {
      console.log(err);
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
                onChange={(e) => setAmountIn(e.target.value)}
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
                {tokenIn.symbol}
              </div>
            </div>
          </div>
          <Button
            loading={loading}
            onClick={lock}
            disabled={
              tokensIn?.length <= 0 ||
              !auth ||
              claims?.length > 0 ||
              chainId !== networkIn?.networkId
            }
            style={{ marginTop: "32px" }}
            size="xl"
            color="danger"
          >
            Transfer
          </Button>
          {claims.length > 0 && (
            <Button
              loading={claimLoading}
              onClick={claim}
              disabled={!auth || claims[0]._targetNetworkChainId !== chainId}
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
