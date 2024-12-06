import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineCheck, HiOutlinePencil, HiOutlineX, HiOutlinePlus } from "react-icons/hi";
import { Pagination, HR, Badge, Button, Card } from "flowbite-react";
import classes from './card-selected-ids.module.scss';
import { getCallerIdsApiController } from '../../utils/api/caller-ids.api';
import { resetDeletedCallerIds, removeDeletedCallerIds, addDeletedCallerIds } from '../../store/scheduleCallSlice';
import SearchInputComponent from '../search-input/search-input';

export default function SelectedIdsCardComponent({ showToast, area }) {
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
        results.forEach(({ displayName, _id }) => {
            ids[_id] = displayName
            if (!(deletedCallerIds[_id])) {
                filteredIds[_id] = displayName
            }
        });
        setCallerIds({
            totalPages,
            totalRecords,
            results: { ...ids }
        });
        setSelectedIds({ ...filteredIds });
    }

    useEffect(() => {
        setSelectedIds({});
        dispatch(resetDeletedCallerIds({}));
        setEditMode(false);
        setCurrentPage(1);
        getCallerIds(1);
    }, [area]);

    const onPageChange = async (page) => {
        getCallerIds(page);
        setCurrentPage(page);
    };

    const unSelectCallerIdHandler = (_id) => {
        const oldSelectedIds = { ...selectedIds };
        const ids = { _id, displayName: oldSelectedIds[_id] };
        dispatch(addDeletedCallerIds(ids));        
        delete oldSelectedIds[_id];
        setSelectedIds({ ...oldSelectedIds });
    }

    const selectCallerIdHandler = (_id) => {
        const displayName = callerIds.results[_id];
        dispatch(removeDeletedCallerIds({ _id }));    
      
        if (displayName) {
            setSelectedIds({
                [_id]: displayName,
                ...selectedIds,
            });
        }
    }

    const handleSeachInputFn = (value = '') => {
        getCallerIds(1, value);
    }

    const editIdsHandler = () => {
        const mode = editMode;
        setEditMode(!mode);
    }

    return <>
        <Card className={`max-w-md ${classes.cardContainer}`}>
            <div className={`flex justify-end ${classes.actionItem}`}>
                <div>
                    <SearchInputComponent callbackFn={handleSeachInputFn}/>
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
                                    Object.keys(selectedIds).map((_id, indx) => (
                                        <Badge className={classes.badge} icon={HiOutlineCheck} key={`users_id_${indx}`} color="info">{selectedIds[_id]}</Badge>
                                    ))
                                }
                            </div> : <span className="text-xs">No Caller ID has been added in this selected area</span>
                        }
                    </div> : <div className={`${classes.editContainer}`}>
                        <div className={`${classes.availableIdContainer} ${classes.callerIdListContainer}`}>
                            <span className={classes.title}>Selected Caller Ids</span>
                            <div className={`flex flex-wrap gap-2 ${classes.listContainer}`}>
                                {
                                    Object.keys(selectedIds).map((_id, indx) => (
                                        <Button onClick={() => unSelectCallerIdHandler(_id)} className={classes.deleteCallerIdBtn} key={`users_id_${indx}`} color="light">
                                            <HiOutlineX className="mr-2 h-5 w-5" />
                                            {selectedIds[_id]}
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
                                        Object.keys(deletedCallerIds).map((_id, indx) => (
                                            <Button onClick={() => selectCallerIdHandler(_id)} className={classes.deleteCallerIdBtn} key={`users_id_${indx}`} color="dark">
                                                <HiOutlinePlus className="mr-2 h-5 w-5" />
                                                {deletedCallerIds[_id]}
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