import { Typography } from "ui";
import { Container } from "ui/Container/Container";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <Container maxWidth={1200} className={styles.wrapper}>
      <Typography variant="title4" weight="light">
        logo
      </Typography>
      <div>logo</div>
    </Container>
  );
};

export { Navbar };
