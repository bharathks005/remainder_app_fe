import { useRef, useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from '../../store/toastSlice';
import { addCallerId, removeCallerId, updateScheduleData, deleteScheduleData } from '../../store/callerIdsSlice';
import classes from './home.module.scss';
import { HR, Badge, Select, Spinner, Timeline, Textarea, Button, Card, Label, TextInput } from "flowbite-react";
import validateDateTimePicker from '../../helper/dateValidation';
import CallerTableComponent from '../../components/callerTable/callerTable';
import { HiClock, HiOutlineCheck, HiOutlinePencil, HiOutlineX, HiOutlinePlus } from "react-icons/hi";
import CallerIdsPage from '../callerIds/callerIds';
import {
	getCallerIdsApiController,
	scheduleCallApiController,
	deleteCallerIdApiController,
	getScheduleApiController,
	deleteScheduleCallApiController
} from '../../utils/api/caller-ids.api';

export default function HomePage({ isConnected }) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.user);
	const { upCommingSchedule = [] } = useSelector(state => state.callerId.scheduledData);
	const createCallerIdsStatus = useSelector(state => state.callerId.createCallerIdsStatus);
	const [selectedIds, setSelectedIds] = useState([]);
	const [deletedIds, setDeletedIds] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const dateInput = useRef(null);
	const notesInput = useRef(null);

	const showToast = useCallback((type, message) => {
		dispatch(addToast({
			id: Date.now(),
			type,
			message
		}));
	}, [dispatch]);

	const getScheduleData = async () => {
		const res = await getScheduleApiController();
		if (res.status !== 200) {
			showToast('error', 'Failed to get scheduled Data');
			return;
		}
		const { upCommingSchedule = [], pastSchedule = [] } = res.data;

		dispatch(updateScheduleData({ upCommingSchedule, pastSchedule }));
	}

	const getCallerIds = async () => {
		const res = await getCallerIdsApiController({ page: 1, allRecord: false });
		if (res.status !== 200) {
			showToast('error', 'Failed to get callIds');
			return;
		}
		const callerIds = res.data;
		dispatch(addCallerId({ ...callerIds }));
		const resulsts = callerIds?.results || [];
		const data = resulsts.map(({ friendlyName, sid }) => {
			return { friendlyName, sid }
		});
		if (data.length) {
			setSelectedIds([...data]);
		} else {
			setSelectedIds([]);
		}
	}

	useEffect(() => {
		try {
			if (user?.admin) {
				getCallerIds();
				getScheduleData();
			}
		} catch (e) {
			console.error(e);
			showToast('error', 'Failed to get callIds');
		}
	}, [user]);

	useEffect(() => {
		if (createCallerIdsStatus?.status === 'success') {
			getCallerIds();
		}
	}, [createCallerIdsStatus?.status, getCallerIds])


	const areaHandler = async (event) => {
		const value = event.target.value;
		const res = await getCallerIdsApiController({ page: 1, area: value });
		if (res.status !== 200) {
			showToast('error', 'Failed to get callIds');
			return;
		}
		const callerIds = res.data;
		const resulsts = callerIds?.results || [];
		const data = resulsts.map(({ friendlyName, sid }) => {
			return { friendlyName, sid }
		});
		if (data.length) {
			setSelectedIds([...data]);
		} else {
			setSelectedIds([]);
		}
		setDeletedIds([]);
	}

	const unSelectCallerIdHandler = (indx) => {
		const oldSelectedIds = [...selectedIds];
		setDeletedIds([
			...deletedIds,
			oldSelectedIds[indx]
		]);
		oldSelectedIds.splice(indx, 1);
		setSelectedIds([...oldSelectedIds]);
	}

	const selectCallerIdHandler = (indx) => {
		const oldDeletedIds = [...deletedIds];
		setSelectedIds([
			...selectedIds,
			oldDeletedIds[indx]
		]);
		oldDeletedIds.splice(indx, 1);
		setDeletedIds([...oldDeletedIds]);
	}

	const editIdsHandler = () => {
		const mode = editMode;
		setEditMode(!mode);
	}

	const scheduleCallHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const date = formData.get("dateAndTime");
		const notes = formData.get("notes");
		const validateDate = validateDateTimePicker(date);
		if (!validateDate.isValid) {
			setErrorMessage(validateDate.error);
			return;
		}
		if (!selectedIds.length) {
			showToast('error', 'Please Select the Caller Ids');
			return;
		}
		setErrorMessage('');
		setIsLoading(true);
		const selectedCalledIds = selectedIds.map(({ sid }) => sid);
		try {
			const response = await scheduleCallApiController({ date, notes, selectedIds: selectedCalledIds });

			if (response.status !== 200) {
				setIsLoading(false);
				showToast('error', 'Failed to schedule call');
				return;
			}
			showToast('success', 'Scheduled Call Successfully!!');
			getScheduleData();
			setIsLoading(false);
			dateInput.current.value = '';
			notesInput.current.value = '';
		} catch (e) {
			setIsLoading(false);
			showToast('error', 'Failed to schedule call');
		}
	}

	const deleteCallerId = async (ids) => {
		setIsTableLoading(true);
		const res = await deleteCallerIdApiController(ids);
		if (res.status !== 200) {
			showToast('error', 'Failed to delete CallerId');
			setIsTableLoading(false);
			return false;
		}
		setIsTableLoading(false);		
		dispatch(removeCallerId(ids));
		return true;
	}

	const deleteSchedule = async (id) => {
		const res = await deleteScheduleCallApiController(id)
		if (res.status !== 200) {
			showToast('error', 'Failed to delete Schedule');
			return;
		}
		setIsTableLoading(false);
		dispatch(deleteScheduleData(id));
	}
	return <>
		<div className={classes.homeContainer}>
			{
				user?.admin && <div className={classes.schedule}>
					<div className={`${classes.scheduleContainer} flex items-center justify-between min-h-screen py-2`}>
						<div className="flex flex-col justify-center w-full md:w-1/2">
							<Card className="max-w-md">
								<form className="flex flex-col gap-4" onSubmit={scheduleCallHandler}>
									<div className="max-w-md">
										<div className="mb-2 block text-left">
											<Label htmlFor="dateAndTime" value="Date And Time" />
										</div>
										<TextInput ref={dateInput} name="dateAndTime" id="dateAndTime" type="datetime-local" required
											color={errorMessage ? "failure" : ""}
											helperText={
												errorMessage ? <span className="font-medium" >{errorMessage}</span> : ""
											}
										/>
									</div>
									<div className="max-w-md">
										<div className="mb-2 block">
											<Label htmlFor="area" value="Select your area" />
										</div>
										<Select id="area" name="area" onChange={areaHandler}>
											<option value="">default</option>
											<option value="area_1">area 1</option>
											<option value="area_2">area 2</option>
											<option value="area_3">area 3</option>
										</Select>
									</div>

									<Card className="max-w-md">
										{
											selectedIds.length ? <div className={`flex justify-end`}>
												<Button color="gray" className={classes.editBtn} onClick={editIdsHandler}>
													{!editMode ? <HiOutlinePencil className="h-4 w-4" /> : <HiOutlineX className="h-4 w-4" />}
												</Button>
											</div> : <></>
										}
										{
											!editMode ? <>
												<div className={`flex flex-wrap gap-2 ${classes.listCallerName}`}>
													{
														selectedIds.length ? selectedIds.map(({ friendlyName }, indx) => (
															<Badge className={classes.badge} icon={HiOutlineCheck} key={`users_id_${indx}`} color="info">{friendlyName}</Badge>
														)) : <>No Caller ID has been added in this selected area</>
													}
												</div>
											</> : <div className={`${classes.editContainer}`}>
												<div className={`${classes.availableIdContainer}`}>
													<span className={classes.title}>Selected Caller Ids</span>
													<div className={`flex flex-wrap gap-2 ${classes.listContainer}`}>
														{
															selectedIds.map(({ friendlyName }, indx) => (
																<Button onClick={() => unSelectCallerIdHandler(indx)} className={classes.deleteCallerIdBtn} key={`users_id_${indx}`} color="light">
																	<HiOutlineX className="mr-2 h-5 w-5" />
																	{friendlyName}
																</Button>
															))
														}
													</div>
												</div>
												{
													deletedIds.length ? <> <HR /><div className={`${classes.deletedIdContainer}`}>
														<span className={classes.title}>Deleted Caller Ids</span>
														<div className={`flex flex-wrap gap-2 ${classes.listContainer}`}>
															{
																deletedIds.map((item, indx) => (
																	<Button onClick={() => selectCallerIdHandler(indx)} className={classes.deleteCallerIdBtn} key={`users_id_${indx}`} color="dark">
																		<HiOutlinePlus className="mr-2 h-5 w-5" />
																		{item?.friendlyName}
																	</Button>
																))
															}
														</div>
													</div></> : <></>
												}



											</div>
										}
									</Card>
									<div>
										<div className="mb-2 block text-left">
											<Label htmlFor="notes" value="Notes" />
										</div>
										<Textarea ref={notesInput} id="notes" name="notes" placeholder="Leave a comment..." required rows={4} />
									</div>
									<Button type="submit" color="dark" className={classes.scheduleBtn} disabled={isLoading}>
										{
											isLoading ? <Spinner color="info" aria-label="loading state" /> : <span> <HiClock /> Schedule Call 	</span>}
									</Button>
								</form>

								<div className={classes.upcommingSchedule}>
									<Timeline>
										{
											upCommingSchedule.map(({ date, notes, schedulerName }, index) => <Timeline.Item key={`timeline-indx-${index + 1}`}>
												<Timeline.Point />
												<Timeline.Content>
													<Timeline.Time>{date}</Timeline.Time>
													<Timeline.Body>
														{notes}
													</Timeline.Body>
													<Button color="gray" onClick={() => deleteSchedule(schedulerName)}>
														Cancel
													</Button>
												</Timeline.Content>
											</Timeline.Item>)
										}
									</Timeline>

								</div>
							</Card>
						</div>
						<div className="flex flex-col items-center justify-center w-full md:w-1/2">
							<CallerTableComponent isLoading={isTableLoading} deleteCallerIDHandler={deleteCallerId} />
						</div>
					</div>
				</div>
			}
			<div className={classes.register}>
				<CallerIdsPage user={user} callIdStatus={createCallerIdsStatus?.status} />
			</div>
		</div>
	</>
}

