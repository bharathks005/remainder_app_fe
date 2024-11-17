import classes from './login.module.scss';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getUserApiController } from '../../utils/api/user.api';
import { Spinner } from "flowbite-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const authUser = async () => {
            const res = await getUserApiController();
            setIsLoading(false);
            if (res.status !== 200) {
                return
            }
            navigate('/');
        }
        return () => {
            authUser();
        }
    }, [navigate]);

    const onLoginHandler = () => {
        window.open(`${process.env.REACT_APP_API_URL}/api/auth/google/login`, '_self');
    }

    return <div className={classes.body}>
        <div className={classes.background}>
            <div className={classes.shape}></div>
        </div>
        <div className={classes.card}>
            <h3>Remainder App</h3>
            {
                isLoading ? <Spinner color="info" aria-label="loading state" /> : <button className={classes.loginWithGoogleBtn} onClick={onLoginHandler}>Log In with Google</button>
            }

            <div className={classes.footer}>
                ©2024 GaintechSofware Ltd
            </div>
        </div>
    </div>
}