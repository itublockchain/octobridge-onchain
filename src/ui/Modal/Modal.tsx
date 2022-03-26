import { ComponentPropsWithoutRef, MouseEventHandler } from "react";
import { Icon } from "ui/Icon/Icon";
import { clsnm } from "utils/clsnm";
import styles from "./Modal.module.scss";
import { MdClose } from "react-icons/md";
import { useOnClickOutside } from "hooks/useOnClickOutside";

interface ModalProps extends ComponentPropsWithoutRef<"div"> {
  isOpen: boolean;
  close: MouseEventHandler<HTMLDivElement>;
  disableCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  close,
  children,
  disableCloseButton,
  className,
  ...props
}: ModalProps) => {
  const ref = useOnClickOutside<HTMLDivElement>(() => {
    close?.(null as any);
  });

  return (
    <div className={clsnm(styles.wrapper, isOpen && styles.open)} {...props}>
      <div ref={ref} className={clsnm(styles.body, className)}>
        {!disableCloseButton && (
          <Icon onClick={close} className={styles.close}>
            <MdClose />
          </Icon>
        )}
        {children}
      </div>
      <div className={styles.layout}></div>
    </div>
  );
};

export { Modal };
