import { Footer } from "flowbite-react";
import classes from './footer.module.scss';

export default function FooterComponent() {
  return (
    <Footer container className={classes.footer}>
      <Footer.Copyright href="#" by="GaintechSofware Ltd" year={2024} />
      <Footer.LinkGroup>
        <Footer.Link href="#">About</Footer.Link>
        <Footer.Link href="#">Privacy Policy</Footer.Link>
        <Footer.Link href="#">Licensing</Footer.Link>
        <Footer.Link href="#">Contact</Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  );
}
