import {
  cloneElement,
  ComponentPropsWithoutRef,
  Dispatch,
  forwardRef,
  isValidElement,
  MouseEventHandler,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
import { clsnm } from "utils/clsnm";
import styles from "./Icon.module.scss";

interface Props extends ComponentPropsWithoutRef<"div"> {
  size?: number;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const Icon = (
  { size = 20, className, children, onClick, ...props }: Props,
  ref: RefObject<HTMLDivElement>
) => {
  const childrenWithProps = () => {
    if (isValidElement(children)) {
      return cloneElement<any>(children, {
        width: size,
        height: size,
      });
    }
    return children;
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={clsnm(styles.icon, className)}
      {...props}
    >
      {childrenWithProps?.()}
    </div>
  );
};

const forwardedRef = forwardRef<HTMLDivElement, Props>(Icon as any);
export { forwardedRef as Icon };
