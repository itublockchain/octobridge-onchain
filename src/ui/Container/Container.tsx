import { ComponentPropsWithoutRef } from "react";
import { clsnm } from "utils/clsnm";
import styles from "./Container.module.scss";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  maxWidth?: number;
}

const Container = ({ children, maxWidth, className }: ContainerProps) => {
  return (
    <div
      style={{ maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
      className={clsnm(styles.wrapper, className)}
    >
      {children}
    </div>
  );
};

export { Container };
