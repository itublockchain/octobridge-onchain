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

const Modal = ({ isOpen, close, children, disableCloseButton }: ModalProps) => {
  const ref = useOnClickOutside<HTMLDivElement>(() => {
    close?.(null as any);
  });

  return (
    <div className={clsnm(styles.wrapper, isOpen && styles.open)}>
      <div ref={ref} className={styles.body}>
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
