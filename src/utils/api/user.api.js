import axios from 'axios';

export async function getUserApiController() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Authentication Failed'
            }
        }
        const data = await response.data;
        return {
            status: 200,
            data
        }
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: 'API Error'
        }
    }
}

export async function logoutUserApiController() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`, { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to Logout'
            }
        }
        const data = await response.data;
        return {
            status: 200,
            data
        }
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: 'API Error'
        }
    }
}

export async function authApiController() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/validate`, { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to Auth'
            }
        }
        const data = await response.data;
        return {
            status: 200,
            data
        }
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: 'API Error'
        }
    }
}