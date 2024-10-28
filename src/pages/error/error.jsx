import { useNavigate, useRouteError } from "react-router-dom";
import HeaderComponent from "../../components/ui/header/header";
import FooterComponent from "../../components/ui/footer/footer";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserApiController } from '../../utils/api/user.api';
import { removeUser } from '../../store/userSlice';
import classes from './error.module.scss';
import { Button } from "flowbite-react";

export default function ErrorPage() {
    const user = useSelector(state => state.user.user);
    const error = useRouteError();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.error(error);

    const handleLogout = async () => {
        const res = await logoutUserApiController();
        if (res.status !== 200) {
            return
        }
        dispatch(removeUser(null));
        navigate('/login');
    };

    return (
        <div id="error-page">
            <div className="App-header">
                <HeaderComponent user={user} logoutHandler={handleLogout} />
            </div>
            <div className="error-container">
                <h1 className={classes.oops}>Oops!</h1>
                <div className={classes.mainSection}>
                    <p>Sorry, an unexpected error has occurred.</p>
                    <p>
                        <i>{error?.statusText || error?.message}</i>
                    </p>
                </div>
                <div className={classes.action}>
                    <Button color="dark" onClick={() => navigate('/')}>Go Back</Button>
                </div>
            </div>
            <div className="App-footer">
                <FooterComponent />
            </div>
        </div>
    );
}
