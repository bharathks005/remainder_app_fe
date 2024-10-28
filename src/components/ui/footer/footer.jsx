import { Footer } from "flowbite-react";
import classes from './footer.module.scss';

export default function FooterComponent() {
  return (
    <Footer container className={classes.footer}>
      <Footer.Copyright href="#" by="GaintechSofware Ltd" year={2024} />
    </Footer>
  );
}
