import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useRef, useEffect } from 'react';
import { Spinner, Button, Table, Label, Card, TextInput } from "flowbite-react";
import { HiOutlinePencil, HiOutlineCheck } from "react-icons/hi";
import classes from './areas.module.scss';
import { addToast } from '../../store/toastSlice';
import { createNewEnumsApiController, getAreasEnumsApiController, updateAreasEnumsApiController } from '../../utils/api/enum.api';
import { updateEnums } from '../../store/enumSlice';

export default function AreasComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditmode] = useState(false);
    const [selectedArea, setSelectedArea] = useState({
        name: '',
        id: ''
    });
    const dispatch = useDispatch();
    const areasEnums = useSelector(state => state.enum.areas || []);
    const areaInput = useRef(null);
    const getAreasEnums = async () => {
        const res = await getAreasEnumsApiController();
        if (res.status !== 200) {
            showToast('error', 'Failed to get Areas');
            setIsLoading(false);
        } else {
            const areas = res.data
            dispatch(updateEnums([...areas]));
            setIsLoading(false);
        }
    }

    const showToast = useCallback((type, message) => {
        dispatch(addToast({
            id: Date.now(),
            type,
            message
        }));
    }, [dispatch]);

    const toggleEditmode = () => {
        setEditmode((oldvalue) => {
            return !oldvalue
        });
    }

    const updateAreasUi = (area) => {
        setSelectedArea({
            name: area?.name, id: area?._id
        });
        areaInput.current.value = area?.name;
        setEditmode(true);
    }

    const cancelEditMode = () => {
        setSelectedArea({
            name: '', id: ''
        });
        areaInput.current.value = '';
        setEditmode(false);
    }

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);
        const data = {
            area: formData.get("area_name") || ''
        };
        if (data.area) {            
            let res;
            if (editMode) {
                data.id = selectedArea?.id;
                res = await updateAreasEnumsApiController(data);
            } else {
                res = await createNewEnumsApiController(data);
            }
            if (res.status !== 200) {               
                if (editMode) {
                    if (res.status === 409) {   
                        showToast('error', 'Area is already added. Please check!');                 
                    } else {
                        showToast('error', `Failed to ${!editMode ? 'create new' : 'update'} Area`);                        
                    }                    
                }                
                setIsLoading(false);
                areaInput.current.value = '';                
                return false;
            }
            getAreasEnums();
        }
        setEditmode(false);
        areaInput.current.value = '';
        setIsLoading(false);
    }

    return (
        <div className={`${classes.areasContainer} w-full`}>
            <div className={classes.areasForm}>
            <Card className="mt-5 max-w-">
                <form
                    className={`${isLoading ? classes.pending : ''} flex flex-col gap-4`}
                    onSubmit={formSubmitHandler}
                >
                    <div className="text-left max-w-lg">
                        <div className="mb-2 block">
                            <Label className="align-center" htmlFor="area_name" value="Enter the Area Name" />
                        </div>
                        <TextInput
                            ref={areaInput}
                            id="area_name"
                            type="text"
                            name="area_name"
                            placeholder="Area Name"
                            required
                        />
                    </div>
                    {
                        !editMode ? <Button color="dark" type="submit" className={classes.submit}>{isLoading ? <Spinner color="info" aria-label="loading state" /> : 'Add'}</Button> : <div className={classes.action}><Button color="light" className={classes.cancel} onClick={cancelEditMode}>Cancel</Button><Button color="dark" type="submit" className={classes.submit}>{isLoading ? <Spinner color="info" aria-label="loading state" /> : 'Save'}</Button></div>
                    }

                </form>
            </Card>
            </div>
            <div className={`${classes.areasList}`}>
                <Table className={`${isLoading ? classes.tableloading : ''}`}>
                    <Table.Head>
                        <Table.HeadCell>Edit</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            areasEnums.map((area) => (
                                <Table.Row key={`table-row-${area?._id}`} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell><div className={classes.actionBtn}>{
                                        (editMode && selectedArea?.id === area?._id) ? <HiOutlineCheck color="#81f492" onClick={() => cancelEditMode()} /> : <HiOutlinePencil onClick={() => updateAreasUi(area)} />
                                    }</div></Table.Cell>
                                    <Table.Cell>{area?.name}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
}
