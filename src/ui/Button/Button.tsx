import React, { forwardRef } from "react";
import { Spinner } from "ui/Spinner/Spinner";
import { clsnm } from "utils/clsnm";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  variant?: "contained" | "outlined";
  color?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "ghost-light"
    | "ghost-dark";
  size?: "xl" | "l" | "m" | "s";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color,
      variant,
      size,
      loading,
      startIcon: startIconProp,
      endIcon: endIconProp,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const startIcon = startIconProp && (
      <span
        className={clsnm(styles.startIcon, children && styles.startIconMargin)}
      >
        {startIconProp}
      </span>
    );

    const endIcon = endIconProp && (
      <span className={clsnm(styles.endIcon, children && styles.endIconMargin)}>
        {endIconProp}
      </span>
    );

    const loadingIndicator = loading && (
      <span className={styles.spinner}>
        <Spinner size={24} />
      </span>
    );

    return (
      <button
        ref={ref}
        className={clsnm(
          styles.btn,
          styles[color as string],
          styles[size as string],
          loading && "loading",
          styles[variant ?? (color === "secondary" ? "outlined" : "contained")],
          className
        )}
        {...props}
      >
        {startIcon}
        {children}
        {endIcon}
        {loadingIndicator}
      </button>
    );
  }
);

export { Button };
