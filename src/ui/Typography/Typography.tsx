import * as React from "react";
import { clsnm } from "utils/clsnm";
import styles from "./Typography.module.scss";

type TypographyVariants =
  | "title1"
  | "title2"
  | "title3"
  | "title4"
  | "title5"
  | "headline"
  | "body1"
  | "body2"
  | "caption";

type TypographyWeights = "semibold" | "medium" | "regular";

type TypographyOwnProps = {
  as?: React.ElementType;
  variant: TypographyVariants;
  weight?: TypographyWeights;
  decor?: "underline";
};

type TypographyProps = TypographyOwnProps &
  Omit<React.AllHTMLAttributes<any>, keyof TypographyOwnProps>;

const Typography = React.forwardRef((props: TypographyProps, ref) => {
  const {
    variant,
    weight,
    decor,
    as: Component = "span",
    className,
    children,
    ...rest
  } = props;

  return (
    <Component
      ref={ref}
      className={clsnm(
        styles.text,
        styles[variant],
        weight && styles[weight],
        decor && styles[decor],
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
});

export { Typography };
