import axios from 'axios';

export async function getCallerIdsApiController() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/caller-ids/getOutgoingCallerIds`, { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'failed to get caller ids'
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

export async function deleteCallerIdApiController(selectedIds) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/caller-ids/delete`, { sid: selectedIds }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'failed to delete caller ids'
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

export async function scheduleCallApiController(date) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/schedule-call/create`, { date }, {
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

export async function syncCallerIdsApiController() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/caller-ids/syncOutgoingCallerIds`,
            { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to Sync Caller Ids'
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

export async function craeteCallerIdApiController(body) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/caller-ids/createCallerIds`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to Creata CallerID'
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

