import { useEffect } from "react";
import { useRef } from "react";

import { useStatus } from "./useStatus";

type RequestCallback = (...args: any) => Promise<any> | undefined | null | void;

type Options<P extends RequestCallback> = {
  onStart?: () => any;
  onSuccess?: (res: any, ...args: Parameters<P>) => any;
  onFail?: (err: any, ...args: Parameters<P>) => any;
  initialStatus?: import("./useStatus").statuses;
  waitFinish?: boolean;
};

export function useApiRequest<P extends RequestCallback>(
  promiseCb: P,
  { onStart, onSuccess, onFail, initialStatus, waitFinish }: Options<P> = {}
): { exec: P; status: import("./useStatus").statusObject } {
  const mountedRef = useRef(false);
  const status = useStatus(initialStatus);

  useEffect((): any => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const executeRequest = (...args: any) => {
    if (waitFinish && status.isPending) return new Promise(() => {});

    const promise: any = promiseCb?.(...args);

    if (promise instanceof Promise) {
      status.pending();
      onStart?.();
      return new Promise((resolve, reject) =>
        promise?.then?.(
          (res) => {
            if (mountedRef.current === true) {
              status.success(res);
            }
            onSuccess?.(res, ...args);
            resolve?.(res);
          },
          (err) => {
            if (mountedRef.current === true) {
              status.fail(err);
            }
            onFail?.(err, ...args);
            reject(err);
          }
        )
      );
    }

    return new Promise(() => {});
  };

  // @ts-ignore
  return { exec: executeRequest, status };
}
