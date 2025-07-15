import { Select, Button, Modal, Label, TextInput, TabItem, Tabs, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { HiClipboardList, HiUserCircle } from "react-icons/hi";
import AreasComponent from '../../components/areas/areas';
import CallerIdTableComponent from '../../components/caller-id-table/caller-id-table';
import { useRef, useState, useCallback } from 'react';
import { updateCallerIdApiController } from '../../utils/api/caller-ids.api';
import { useSelector, useDispatch } from "react-redux";
import { addToast } from '../../store/toastSlice';
import { updateCallerIdsData } from '../../store/callerIdsSlice';

const AdminPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [id, setId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const displayNameInput = useRef(null);
    const areaNameInput = useRef(null);
    const dispatch = useDispatch();
    const areasEnums = useSelector(state => state.enum.areas);

    const formHandler = async () => {
        setIsLoading(true);
        const data = {
            displayName: displayNameInput.current.value,
            area: areaNameInput.current.value
        }
        const res = await updateCallerIdApiController(data, id);
        if (res.status !== 200) {
            showToast('error', 'Failed to update CallerIds');
            setIsLoading(false);
        } else {
            const data = res.data;
            dispatch(updateCallerIdsData(data));
            setIsLoading(false);
            setOpenModal(false);
            showToast('success', 'Successfully Saved!');
        }
    }

    const showToast = useCallback((type, message) => {
        dispatch(addToast({
            id: Date.now(),
            type,
            message
        }));
    }, [dispatch]);

    const openModalFn = (data) => {
        setOpenModal(true);
        setId(data?._id);
        setTimeout(() => {
            if (displayNameInput.current && areaNameInput.current) {
                displayNameInput.current.value = data.displayName;
                areaNameInput.current.value = data?.area;
            }
        }, 100);
    }
    return <div className={`w-full`}>
        <Tabs aria-label="Default tabs" variant="default">
            <TabItem active title="Areas" icon={HiUserCircle}>
                <AreasComponent />
            </TabItem>
            <TabItem title="Users" icon={HiClipboardList}>
                <CallerIdTableComponent open={openModalFn} />
                <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <ModalHeader>Edit CallerId</ModalHeader>
                    <ModalBody>
                        <div className="space-y-6">
                            <div className="text-left max-w-lg">
                                <div className="mb-2 block">
                                    <Label className="align-center" htmlFor="display_name" value="Display Name" />
                                </div>
                                <TextInput
                                    ref={displayNameInput}
                                    id="area_name"
                                    type="text"
                                    name="display_name"
                                    placeholder="Display Name"
                                    required
                                />
                            </div>
                            <div className="text-left max-w-lg">
                                <div className="mb-2 block">
                                    <Label className="align-center" htmlFor="area_name" value="Area Name" />
                                </div>                               
                                <Select id="area_name" name="area_name" ref={areaNameInput}>                                    
                                    {
                                        areasEnums.map(({ name }) => (
                                            <option value={name} key={name}>{name}</option>
                                        ))
                                    }
                                </Select>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={formHandler}>{
                            isLoading ? 'Loading...' : 'Save'}</Button>
                        <Button color="alternative" onClick={() => setOpenModal(false)}>
                            Back
                        </Button>
                    </ModalFooter>
                </Modal>
            </TabItem>
        </Tabs>
    </div>
}

export default AdminPage;