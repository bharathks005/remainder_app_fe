import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Flowbite } from "flowbite-react";
import classes from './header.module.scss';

export default function HeaderComponent({ user, logoutHandler }) {
    return (
        <Flowbite>
            <Navbar fluid rounded className={classes.header}>
                <Navbar.Brand >
                    <span className="self-center whitespace-nowrap text-xl px-2 font-semibold dark:text-white">
                        Remainder App
                    </span>
                </Navbar.Brand>
                {
                    user && <div className="flex md:order-2">
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar alt="User settings" img={user.picture} rounded />
                            }>
                            <Dropdown.Header>
                                <span className="block text-sm">{user.displayName}</span>
                                <span className="block truncate text-sm font-medium">{user.email}</span>
                            </Dropdown.Header>
                            <Dropdown.Item onClick={() => logoutHandler()}>Sign out</Dropdown.Item>
                        </Dropdown>
                    </div>
                }
            </Navbar>
        </Flowbite >
    );
}
