import "./App.css";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "./components/ui/header/header";
import FooterComponent from "./components/ui/footer/footer";
import ToastComponent from "./components/ui/toast/toast";
import React, { useEffect, useState } from 'react';
import { getUserApiController, logoutUserApiController } from './utils/api/user.api';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, removeUser } from './store/userSlice';
import { Spinner } from "flowbite-react";
import HomePage from "./pages/home/home";
import useWebSocket from './utils/hooks/websocket';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const protocol = window.location.protocol;
    const { isConnected } = useWebSocket(`${protocol === 'https:' ? 'wss': 'ws'}://${process.env.REACT_APP_SOCKET_URL}`, {
        reconnectInterval: 3000,
        maxReconnectAttempts: 5
    });
    console.log(protocol, 'protocol')
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getUser = async () => {
        if (!user) {
            const res = await getUserApiController();
            if (res.status !== 200) {
                navigate('/login');
                return
            }
            const user = res.data;
            const { name, email, picture, admin, approved } = user;
            if (email) {
                dispatch(updateUser({
                    name, email, picture, admin, approved
                }));
            }
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const handleLogout = async () => {
        const res = await logoutUserApiController();
        if (res.status !== 200) {
            return
        }
        dispatch(removeUser(null));
        navigate('/login');
    };
    return (
        <div className="App">
            {
                isLoading ? <Spinner color="info" aria-label="loading state" /> : <>
                    <div className="App-header">
                        <HeaderComponent user={user} logoutHandler={handleLogout} />
                    </div>
                    <div className="App-container">
                        <HomePage isConnected={isConnected} />

                        <div className="toast-conatiner">
                            <ToastComponent />
                        </div>
                    </div>
                    <div className="App-footer">
                        <FooterComponent />
                    </div>
                </>
            }

        </div>
    );
}

export default App;
