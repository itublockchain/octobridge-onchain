import { useState } from "react";
import { toast } from "react-toastify";
import { IS_PROD } from "utils/isProd";

export const useRequest = (
  func: any,
  { errorMsg, onStart, onFinished, onFail } = {} as {
    onFinished?: any;
    onFail?: any;
    onStart?: any;
    errorMsg?: any;
  }
) => {
  const [loading, setLoading] = useState(false);

  const fn = {
    exec: async function (...args: any) {
      try {
        setLoading(true);
        onStart?.();
        const res = await func?.(...args);
        setLoading(false);
        onFinished?.(res, ...args);
        return res;
      } catch (err: any) {
        toast(errorMsg);
        try {
          if (!IS_PROD) {
            console.log(...err);
          }
        } catch {}
        setLoading(false);
        onFail?.();
        if (!IS_PROD) {
          throw new Error(err);
        }
      }
    },
    loading: loading,
  };

  return fn;
};
