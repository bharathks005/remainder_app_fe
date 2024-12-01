import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineCheck, HiOutlinePencil, HiOutlineX, HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";
import { Pagination, HR, Badge, Button, Card, TextInput } from "flowbite-react";
import classes from './card-selected-ids.module.scss';
import debounce from 'lodash.debounce';
import { getCallerIdsApiController } from '../../utils/api/caller-ids.api';
import { removeDeletedCallerIds, addDeletedCallerIds } from '../../store/scheduleCallSlice';

export default function SelectedIdsCardComponent({ showToast, area, updateSelectedIds }) {
    const dispatch = useDispatch();
    const { deletedCallerIds = {} } = useSelector(state => state.scheduleCall);
    const [selectedIds, setSelectedIds] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [callerIds, setCallerIds] = useState({
        totalPages: 1,
        totalRecords: 0,
        results: {}
    });

    const searchCallerIdHandler = async (e) => {
        const value = e.target.value || '';
        getCallerIds(currentPage, value);
    }

    const getCallerIds = async (page = 1, search = null) => {
        const res = await getCallerIdsApiController({ page, area, search });
        if (res.status !== 200) {
            showToast('error', 'Failed to get callIds');
            return;
        }
        const { totalPages = 0,
            totalRecords = 0,
            results = [] } = res.data;
        const ids = {};
        const filteredIds = {};
        results.forEach(({ displayName, sid }) => {
            ids[sid] = displayName
            if (!(deletedCallerIds[sid])) {
                filteredIds[sid] = displayName
            }
        });
        setCallerIds({
            totalPages,
            totalRecords,
            results: {...ids}
        });
        setSelectedIds({...filteredIds});
    }

    const debouncedResults = useMemo(() => {
        return debounce(searchCallerIdHandler, 800);
    }, []);

    useEffect(() => {
        return () => {
            debouncedResults.cancel();
        };
    });

    useEffect(() => {
        getCallerIds(1);
    }, [area]);

    const onPageChange = async (page) => {
        getCallerIds(page);
        setCurrentPage(page);
    };


    const unSelectCallerIdHandler = (sid) => {
        const oldSelectedIds = {...selectedIds};        
        dispatch(addDeletedCallerIds({sid, displayName: oldSelectedIds[sid]}));      
        delete oldSelectedIds[sid];
        setSelectedIds({...oldSelectedIds});       
    }

    const selectCallerIdHandler = (sid) => {
        const displayName = callerIds.results[sid];
        dispatch(removeDeletedCallerIds({sid}));
        if (!(sid in deletedCallerIds)) {
            setSelectedIds({
                [sid]: displayName,
                ...selectedIds,
        });
        }
    }

    const editIdsHandler = () => {
        const mode = editMode;
        setEditMode(!mode);
    }

    return <>
        <Card className={`max-w-md ${classes.cardContainer}`}>
            <div className={`flex justify-end ${classes.actionItem}`}>
                <div>
                    <TextInput id="name_search" icon={HiOutlineSearch} onChange={debouncedResults} placeholder="Search By Name" />
                </div>
                {
                    Object.values(selectedIds).length ? <div><Button color="gray" onClick={editIdsHandler}>
                        {!editMode ? <HiOutlinePencil className="h-4 w-4" /> : <HiOutlineX className="h-4 w-4" />}
                    </Button></div> : <></>
                }
            </div>
            <div>
                {
                    !editMode ? <div className={`flex flex-wrap gap-2`}>
                        {
                            Object.values(selectedIds).length ? <div className={`flex flex-wrap gap-2 ${classes.callerIdListContainer}`}>
                                {
                                    Object.keys(selectedIds).map((sid, indx) => (
                                        <Badge className={classes.badge} icon={HiOutlineCheck} key={`users_id_${indx}`} color="info">{selectedIds[sid]}</Badge>
                                    ))
                                }
                            </div> : <span className="text-xs">No Caller ID has been added in this selected area</span>
                        }
                    </div> : <div className={`${classes.editContainer}`}>
                        <div className={`${classes.availableIdContainer} ${classes.callerIdListContainer}`}>
                            <span className={classes.title}>Selected Caller Ids</span>
                            <div className={`flex flex-wrap gap-2 ${classes.listContainer}`}>
                                {
                                    Object.keys(selectedIds).map((sid, indx) => (
                                        <Button onClick={() => unSelectCallerIdHandler(sid)} className={classes.deleteCallerIdBtn} key={`users_id_${indx}`} color="light">
                                            <HiOutlineX className="mr-2 h-5 w-5" />
                                            {selectedIds[sid]}
                                        </Button>
                                    ))
                                }
                            </div>
                        </div>
                        {
                            Object.keys(deletedCallerIds).length ? <> <HR /><div className={`${classes.deletedIdContainer} ${classes.callerIdListContainer}`}>
                                <span className={classes.title}>Deleted Caller Ids</span>
                                <div className={`flex flex-wrap gap-2 ${classes.listContainer}`}>
                                    {
                                        Object.keys(deletedCallerIds).map((sid, indx) => (
                                            <Button onClick={() => selectCallerIdHandler(sid)} className={classes.deleteCallerIdBtn} key={`users_id_${indx}`} color="dark">
                                                <HiOutlinePlus className="mr-2 h-5 w-5" />
                                                {deletedCallerIds[sid]}
                                            </Button>
                                        ))
                                    }
                                </div>
                            </div></> : <></>
                        }
                    </div>
                }
            </div>
            <div className="flex overflow-x-auto justify-center">
                <Pagination layout="navigation" currentPage={currentPage} totalPages={callerIds?.totalPages} onPageChange={onPageChange} showIcons />
            </div>
        </Card>
    </>
};