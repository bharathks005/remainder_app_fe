import axios from 'axios';


export async function scheduleCallApiController(body) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/schedule-call/create`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to Schedule call'
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

export async function deleteScheduleCallApiController(id) {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/schedule-call/${id}`, { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to Delete Schedule call'
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

export async function getScheduleApiController() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/schedule-call/`, { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'failed to get Schedule'
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
