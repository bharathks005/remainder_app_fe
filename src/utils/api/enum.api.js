import axios from 'axios';

export async function getEnumsApiController() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/enums`, { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to get Enums'
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

export async function createNewEnumsApiController(body) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/enums/create`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to create a new enums'
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
            status: error.status === 409 ? 409 : 500,
            message: 'API Error'
        }
    }
}

export async function getAreasEnumsApiController(body) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/enums/`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to get enums'
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
            status: error.status === 409 ? 409 : 500,
            message: 'API Error'
        }
    }
}

export async function updateAreasEnumsApiController(body) {
    try {
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/enums/update`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to update enums'
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
            status: error.status === 409 ? 409 : 500,
            message: 'API Error'
        }
    }
}