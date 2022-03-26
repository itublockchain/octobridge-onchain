import { useMemo } from "react";
import { useState } from "react";

const PENDING = "PENDING";
const SUCCESS = "SUCCESS";
const FAIL = "FAIL";

/**
 * @typedef {('PENDING'|'SUCCESS'|'FAIL')} statuses
 */

/**
 * Callback for updating status state
 *
 * @callback updateStatus
 * @param {any} [data]
 */

/**
 * Status object with useful methods and payload
 *
 * @typedef {Object} statusObject
 * @property {Boolean} isPending
 * @property {Boolean} isSuccess
 * @property {Boolean} isFail
 * @property {updateStatus} pending
 * @property {updateStatus} success
 * @property {updateStatus} fail
 * @property {*} payload
 */

/**
 * Get an object that will reflect the status
 *
 * @param {statuses} initialState
 * @returns {statusObject}
 */
export function useStatus(initialState = "") {
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState(initialState);

  const statusObj = useMemo(
    () => ({
      isPending: status === PENDING,
      isSuccess: status === SUCCESS,
      isFail: status === FAIL,
      pending: (data) => {
        setStatus(PENDING);
        if (data) setPayload(data);
      },
      success: (data) => {
        setStatus(SUCCESS);
        if (data) setPayload(data);
      },
      fail: (data) => {
        setStatus(FAIL);
        if (data) setPayload(data);
      },
      payload,
    }),
    [payload, status]
  );

  return statusObj;
}
