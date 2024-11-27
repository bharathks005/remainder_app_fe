import { TextInput, Button, Checkbox, Table, Pagination } from "flowbite-react";
import { HiMail, HiOutlineTrash, HiOutlineSearch } from "react-icons/hi";
import classes from './callerTable.module.scss';
import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback } from 'react';
import { Spinner } from "flowbite-react";
import { addToast } from '../../store/toastSlice';
import { addCallerId } from '../../store/callerIdsSlice';
import {
    getCallerIdsApiController,
} from '../../utils/api/caller-ids.api';

export default function CallerTableComponent({ isLoading, deleteCallerIDHandler }) {
    const {
        totalPages = 0,
        totalRecords = 0,
        results = []
    } = useSelector(state => state.callerId.callerIds);
    const [selectedId, setSelectedId] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

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

    const onDeleteHandler = async () => {
        await deleteCallerIDHandler(selectedId);
    }

    const showToast = useCallback((type, message) => {
        dispatch(addToast({
            id: Date.now(),
            type,
            message
        }));
    }, [dispatch]);

    const onPageChange = async (page) => {
        setLoading(true);
        const res = await getCallerIdsApiController({ page, allRecord: false });
        if (res.status !== 200) {
            showToast('error', 'Failed to get callIds');
            setLoading(false);
            return;
        }
        const callerIds = res.data;
        dispatch(addCallerId({ ...callerIds }));
        setLoading(false);
        setCurrentPage(page);
    };

    return (
        <div className={`${classes.tableContainer} w-full`}>
            {isLoading && <div className={classes.isloading}>
                <Spinner color="info" aria-label="loading state" />
            </div>}

            {/* <div className="max-w-full flex justify-end">
                <TextInput id="name_search" icon={HiOutlineSearch} placeholder="Search By Name" />
            </div>      */}

            {selectedId.length ? <div className={classes.action}>
                <Button color="failure" onClick={onDeleteHandler}>
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
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            results.map((callerId, index) => (
                                <Table.Row key={`table-row-${index + 1}`} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="p-4">
                                        <Checkbox onChange={(e) => onSelectHandler(e, callerId.sid)} />
                                    </Table.Cell>
                                    <Table.Cell>{callerId.friendlyName}</Table.Cell>
                                    <Table.Cell>{callerId.phoneNumber}</Table.Cell>
                                </Table.Row>
                            ))
                        }

                    </Table.Body>
                </Table>
            </div>
            {
                !results.length ? <><span>No Caller ID has been added.</span></> : <>
                    {/* {
                    <><span className={classes.totalItems}>
                        Total Items: {totalRecords}
                    </span>
                    </>
                } */}
                    <div className="flex overflow-x-auto sm:justify-center">
                        <Pagination className={classes.pagination} currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                    </div>
                </>
            }
        </div>
    );
}
