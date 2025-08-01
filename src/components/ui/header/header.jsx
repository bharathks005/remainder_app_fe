import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiX, HiOutlineMenu } from "react-icons/hi";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Flowbite } from "flowbite-react";
import { removeUser } from '../../../store/userSlice';
import { logoutUserApiController } from '../../../utils/api/user.api';
import classes from './header.module.scss';

export default function HeaderComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [showNav, setShowNav] = useState(false);
    const [pathName, setPathName] = useState('/');
    const user = useSelector(state => state.user.user);

    useEffect(() => {
        setPathName(location.pathname)
    }, [location]);

    const logoutHandler = async () => {
        const res = await logoutUserApiController();
        if (res.status !== 200) {
            return
        }
        dispatch(removeUser(null));
        navigate('/login');
    };

    const toggleNav = () => {
        setShowNav(!showNav);
    }
    return (
        <>
            <Flowbite>
                <Navbar fluid rounded className={classes.header}>
                    <Navbar.Brand >
                        <span className="self-center whitespace-nowrap text-xl px-2 font-semibold dark:text-white">
                            Remainder App
                        </span>
                    </Navbar.Brand>
                    {
                        user && <div className="flex md:order-2">
                            {
                                user.admin && <div className={`${classes.navigationItem} hidden md:flex`}>
                                    <NavLink to="/" className={`${classes.link} ${pathName === '/' && classes.active}`}>
                                        <span>Home</span>
                                    </NavLink>
                                    <NavLink to="/admin" className={`${classes.link} ${pathName === '/admin' && classes.active}`}>
                                        <span>Admin</span>
                                    </NavLink>
                                    <NavLink to="/register" className={`${classes.link} ${pathName === '/register' && classes.active}`}>
                                        <span>Add User</span>
                                    </NavLink>
                                </div>
                            }

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
                            {
                                user.admin && <div className={`${classes.navToggle} flex md:hidden`} onClick={toggleNav}>
                                    {
                                        showNav ? < HiX className="w-8 h-8" /> : < HiOutlineMenu className="w-8 h-8" />
                                    }
                                </div>
                            }

                        </div>
                    }
                    {
                        showNav && <div className={`${classes.navSessionMobile} w-full md:block md:w-auto md:hidden`}>
                            <NavLink to="/" className={`${classes.link} ${pathName === '/' && classes.active}`} >
                                <span>Home</span>
                            </NavLink>
                            <NavLink to="/admin" className={`${classes.link} ${pathName === '/admin' && classes.active}`} >
                                <span>Admin</span>
                            </NavLink>
                            <NavLink to="/register" className={`${classes.link} ${pathName === '/register' && classes.active}`} >
                                <span>Add User</span>
                            </NavLink>
                        </div>
                    }
                </Navbar>
            </Flowbite >

        </>

    );
}
