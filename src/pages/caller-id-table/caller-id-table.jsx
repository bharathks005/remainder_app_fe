import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useEffect } from 'react';
import { Spinner, Button, Checkbox, Table, Pagination } from "flowbite-react";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import classes from './caller-id-table.module.scss';
import { addToast } from '../../store/toastSlice';
import { removeCallerId } from '../../store/callerIdsSlice';
import { deleteCallerIdApiController } from '../../utils/api/caller-ids.api';
import { getCallerIdsApiController } from '../../utils/api/caller-ids.api';
import SearchInputComponent from '../../components/search-input/search-input';

export default function CallerIdTablePage() {
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector(state => state.user.user);   
    const [callerIds, setCallerIds] = useState({
        totalPages: 0,
        totalRecords: 0,
        results: []
    });
    const [selectedId, setSelectedId] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const getCallerIds = async (page=1, search='') => {
        setLoading(true);
        const res = await getCallerIdsApiController({ page, search});
        if (res.status !== 200) {
            showToast('error', 'Failed to get callIds');
            setLoading(false);
            return;
        }
        const { totalPages = 0,
            totalRecords = 0,
            results = [] } = res.data;
        setCallerIds({
            totalPages,
            totalRecords,
            results
        });
        setLoading(false);
    }
    
    const handleSeachInputFn = (value = '') => {
        getCallerIds(1, value);
    }   

    useEffect(() => {
        try {
            if (user?.admin) {
                getCallerIds();
            }
        } catch (e) {
            console.error(e);
            showToast('error', 'Failed to get callIds');
        }
    }, [user]);

    const onSelectHandler = (e, id) => {
        const target = e.target;
        const oldIds = selectedId;
        if (target.checked) {
            setSelectedId([
                ...oldIds,
                id
            ]);
        } else {
            const newIds = oldIds.filter((callerId) => callerId !== id);
            setSelectedId(newIds);
        }
    }

    const onDeleteCallerIdHandler = async () => {
        setIsLoading(true);
        const res = await deleteCallerIdApiController(selectedId);
        if (res.status !== 200) {
            showToast('error', 'Failed to delete CallerId');
            setIsLoading(false);
            return false;
        }
        setIsLoading(false);
        dispatch(removeCallerId(selectedId));
    }

    const showToast = useCallback((type, message) => {
        dispatch(addToast({
            id: Date.now(),
            type,
            message
        }));
    }, [dispatch]);

    const onPageChange = async (page) => {
        getCallerIds(page);
        setCurrentPage(page);
    };

    return (
        <div className={`${classes.tableContainer} w-full`}>
            {isLoading && <div className={classes.isloading}>
                <Spinner color="info" aria-label="loading state" />
            </div>}
            <div className={classes.searchInput}>
                <SearchInputComponent callbackFn={handleSeachInputFn}/>
            </div>

            {selectedId.length ? <div className={classes.action}>
                <Button color="failure" onClick={onDeleteCallerIdHandler}>
                    <HiOutlineTrash className="mr-2 h-5 w-5" />
                    Delete
                </Button>
            </div> : ''}

            <div className={`${classes.table}`}>
                <Table className={`${loading ? classes.tableloading : ''}`}>
                    <Table.Head>
                        <Table.HeadCell className="p-4">
                        </Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Phone</Table.HeadCell>
                        {/* <Table.HeadCell>Edit</Table.HeadCell> */}
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            callerIds?.results.map((callerId, index) => (
                                <Table.Row key={`table-row-${index + 1}`} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="p-4">
                                        <Checkbox onChange={(e) => onSelectHandler(e, callerId.sid)} />
                                    </Table.Cell>
                                    <Table.Cell>{callerId.displayName}</Table.Cell>
                                    <Table.Cell>{callerId.phoneNumber}</Table.Cell>
                                    {/* <Table.Cell><div className={classes.actionBtn}><HiOutlinePencil /></div></Table.Cell> */}
                                </Table.Row>
                            ))
                        }

                    </Table.Body>
                </Table>
            </div>
            {
                !callerIds?.results.length ? <><span>No Caller ID has been added.</span></> : <>
                    {
                        <span className={classes.totalItems}>
                            {currentPage > 1 ? ((process.env.PAGE_LIMIT || 20) * (currentPage - 1)) + callerIds?.results.length : callerIds?.results.length}   of {callerIds?.totalRecords}
                        </span>
                    }
                    <div className="flex overflow-x-auto sm:justify-center">
                        <Pagination layout="navigation" className={classes.pagination} currentPage={currentPage} totalPages={callerIds?.totalPages} onPageChange={onPageChange} />
                    </div>
                </>
            }
        </div>

    );
}
