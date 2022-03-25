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
        setTimeout(() => {
          setLoading(false);
        }, 3000);
        onFinished?.(res, ...args);
        return res;
      } catch (err: any) {
        toast(errorMsg);
        try {
          if (IS_PROD) {
            console.log(...err);
          }
        } catch {}

        setTimeout(() => {
          setLoading(false);
        }, 3000);

        onFail?.();
        if (err.code == 4001) {
        } else {
          if (process.env.NODE_ENV !== "production") {
            throw new Error(err);
          }
        }
      }
    },
    loading: loading,
  };

  return fn;
};
