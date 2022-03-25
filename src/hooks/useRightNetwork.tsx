import { useAccounts } from "hooks/useAccounts";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "store";
import { setIsRightNetwork } from "store/slicers/global";
import { checkIfRightNetwork } from "utils/checkIfRightNetwork";

export const useRightNetwork = () => {
  const { auth } = useAccounts();
  const isRightNetwork = useTypedSelector(
    (state) => state.global.isRightNetwork
  );
  const dispatch = useDispatch();
  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    if (!auth) return;

    const fetch = async () => {
      const res = await checkIfRightNetwork();
      if (res?.status === false) {
        dispatch(setIsRightNetwork(false));
      }
      setRes(res);
    };
    fetch();
  }, [auth]);

  return { isRightNetwork, res };
};
