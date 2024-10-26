import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Flowbite } from "flowbite-react";

export default function HeaderComponent() {
  return (
    <Flowbite>
      <Navbar fluid rounded>
        <Navbar.Brand >
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Remainder App
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">Caller Ids</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </Flowbite>
  );
}
