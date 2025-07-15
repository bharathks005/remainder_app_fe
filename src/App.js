import "./App.css";
import { useNavigate, Outlet } from "react-router-dom";
import HeaderComponent from "./components/ui/header/header";
import FooterComponent from "./components/ui/footer/footer";
import ToastComponent from "./components/ui/toast/toast";
import React, { useEffect, useState, useCallback } from 'react';
import { getUserApiController } from './utils/api/user.api';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from './store/userSlice';
import { Spinner } from "flowbite-react";
import useWebSocket from './utils/hooks/websocket';
import { getAreasEnumsApiController } from './utils/api/enum.api';
import { getCallerIdsApiController } from './utils/api/caller-ids.api';
import { updateEnums } from './store/enumSlice';
import { addToast } from './store/toastSlice';
import { setCallerIds } from './store/callerIdsSlice';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const protocol = window.location.protocol;
    const { isConnected } = useWebSocket(`${protocol === 'https:' ? 'wss' : 'ws'}://${process.env.REACT_APP_SOCKET_URL}`, {
        reconnectInterval: 3000,
        maxReconnectAttempts: 5
    });
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const showToast = useCallback((type, message) => {
        dispatch(addToast({
            id: Date.now(),
            type,
            message
        }));
    }, [dispatch]);

    const getAreasEnums = async () => {
        const res = await getAreasEnumsApiController();
        if (res.status !== 200) {
            showToast('error', 'Failed to get Areas');
            setIsLoading(false);
        } else {
            const areas = res.data
            dispatch(updateEnums([...areas]));
            setIsLoading(false);
        }
    }

     const getCallerIdsData = async (page = 1, search = '') => {
            const res = await getCallerIdsApiController({ page, search });
            if (res.status !== 200) {
                showToast('error', 'Failed to get callIds');               
                return;
            }    
            const { totalPages = 0,
                totalRecords = 0,
                results = []
            } = res.data;    
            dispatch(setCallerIds({
                page,
                totalPages,
                totalRecords,
                results
            }));           
        }

    useEffect(() => {
        const getUser = async () => {
            if (!user) {
                const res = await getUserApiController();
                if (res.status !== 200) {
                    navigate('/login');
                    return
                }
                const user = res.data;
                const { name, email, picture, admin, approved, registeredCallerId } = user;
                if (email) {
                    if (admin) {
                        console.log('called----------------')
                        getAreasEnums();
                        getCallerIdsData();
                    }
                    dispatch(updateUser({
                        name, email, picture, admin, approved, registeredCallerId
                    }));
                }
                setIsLoading(false);
            }
        }
        getUser();
    }, []);

    return (
        <div className="App">
            {
                isLoading ? <div className="App-loading-icon"><Spinner color="info" aria-label="loading state" /></div> : <>
                    <div className="App-header">
                        <HeaderComponent />
                    </div>
                    <div className="App-container">
                        <Outlet />
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
