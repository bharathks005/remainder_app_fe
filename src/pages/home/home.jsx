import { useRef, useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { HiClock } from "react-icons/hi";
import { addToast } from '../../store/toastSlice';
import { updateScheduleData, deleteScheduleData } from '../../store/scheduleCallSlice';
import classes from './home.module.scss';
import { Select, Spinner, Timeline, Textarea, Button, Card, Label, TextInput } from "flowbite-react";
import validateDateTimePicker from '../../helper/dateValidation';
import { scheduleCallApiController,	getScheduleApiController, deleteScheduleCallApiController } from '../../utils/api/scheduleCall.api';
import SelectedIdsCardComponent from '../../components/card-selected-ids/card.selected-ids';

export default function HomePage() {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.user);
	const { upCommingSchedule = [] } = useSelector(state => state.callerId.scheduledData);
	const { deletedCallerIds = {} } = useSelector(state => state.scheduleCall);	
	const callerIds = useSelector(state => state.callerId.callerIds);	
	const areasEnums = useSelector(state => state.enum.areas);	
	const [area, setArea] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const dateInput = useRef(null);
	const notesInput = useRef(null);
	const areaInput = useRef(null);

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

	useEffect(() => {
		try {
			if (user?.admin) {			
				getScheduleData();
			}
		} catch (e) {
			console.error(e);
			showToast('error', 'Failed to get callIds');
		}
	}, [user]);

	const scheduleCallHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const date = formData.get("dateAndTime");
		const notes = formData.get("notes");
		const area = formData.get("area");
		const validateDate = validateDateTimePicker(date);

		if (!validateDate.isValid) {
			setErrorMessage(validateDate.error);
			return;
		}
		if (!area) {
			showToast('error', 'Please Select the Area');
			return;
		}

		setErrorMessage('');
		setIsLoading(true);
		const deletedIds = Object.keys(deletedCallerIds);
		try {
			const response = await scheduleCallApiController({ date, notes, deletedIds, area });

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
			areaInput.current.value = 'all';
			setArea('all');
		} catch (e) {
			setIsLoading(false);
			showToast('error', 'Failed to schedule call');
		}
	}

	const deleteSchedule = async (id) => {
		const res = await deleteScheduleCallApiController(id)
		if (res.status !== 200) {
			showToast('error', 'Failed to delete Schedule');
			return;
		}		
		dispatch(deleteScheduleData(id));
	}
	
	return <>
		<div className={classes.homeContainer}>
			{
				user?.admin && <div className={classes.schedule}>
					<div className={`${classes.scheduleContainer} flex items-center justify-center min-h-screen py-2`}>
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
										<Select id="area" name="area" onChange={(e) => setArea(e.target.value)} ref={areaInput}>
											<option value="all">default</option>
											{
												areasEnums.map(({name}) => (
													<option value={name} key={name}>{name}</option>
												))
											}
										</Select>
									</div>
									<SelectedIdsCardComponent callerIdsData={callerIds} area={area} showToast={showToast}/>
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
				</div>
			}			
		</div>
	</>
}

