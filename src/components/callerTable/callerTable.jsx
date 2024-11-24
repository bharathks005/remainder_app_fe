import { Button, Checkbox, Table } from "flowbite-react";
import { HiOutlineTrash } from "react-icons/hi";
import classes from './callerTable.module.scss';
import { useSelector } from "react-redux";
import { useState } from 'react';
import { Spinner } from "flowbite-react";

export default function CallerTableComponent({ isLoading, deleteCallerIDHandler }) {
    const callerIds = useSelector(state => state.callerId.callerIds);
    const [selectedId, setSelectedId] = useState([]);
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
        const result = await deleteCallerIDHandler(selectedId);
        console.log(result, 'result');

    }
    return (
        <div className={`${classes.tableContainer} w-full`}>
            {isLoading && <div className={classes.isloading}>
                <Spinner color="info" aria-label="loading state" />
            </div>}
            {selectedId.length ? <div className={classes.action}>
                <Button color="failure" onClick={onDeleteHandler}>
                    <HiOutlineTrash className="mr-2 h-5 w-5" />
                    Delete
                </Button>
            </div> : ''}
            {
                callerIds.length ?  <div className={classes.table}>
                <Table>
                    <Table.Head>
                        <Table.HeadCell className="p-4">
                        </Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Phone</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            callerIds.map((callerId, index) => (
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
            </div> : ""
            }
           
        </div>
    );
}
