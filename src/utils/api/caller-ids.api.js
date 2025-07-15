import axios from 'axios';

export async function getCallerIdsApiController(query) {
   const pageNumber = query?.page || 1;
   const area = query?.area || 'all';
   const search = query?.search || null;
   try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/caller-ids/getOutgoingCallerIds?page=${pageNumber}&area=${area}&search=${search}`, { withCredentials: true });
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

export async function createCallerIdApiController(body) {
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
                message: 'Failed to Create CallerID'
            }
        }
        const data = await response.data;
        return {
            status: 200,
            data
        }
    } catch (error) {
        return {
            status: [409, 400, 404].includes(error.status) ? error.status : 500,
            message: 'API Error'
        }
    }
}

export async function inviteCallersApiController() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/caller-ids/invite-callers`,
            { withCredentials: true });
        if (response.status !== 200) {
            return {
                status: response.status,
                message: 'Failed to get invites'
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

export async function updateCallerIdApiController(body, id) {
    try {
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/caller-ids/updateCallerIds?id=${id}`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });       
        if (response.status !== 200) {            
            return {
                status: response.status,
                message: 'Failed to update CallerID'
            }
        }
        const data = await response.data;
        return {
            status: 200,
            data
        }
    } catch (error) {
        return {
            status: [409, 400, 404].includes(error.status) ? error.status : 500,
            message: 'API Error'
        }
    }
}

