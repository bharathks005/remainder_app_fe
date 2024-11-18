import { useRef, useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from '../../store/toastSlice';
import { addCallerId, removeCallerId, updateScheduleData, deleteScheduleData } from '../../store/callerIdsSlice';
import classes from './home.module.scss';
import { Spinner, Timeline, Textarea, Button, Card, Label, TextInput } from "flowbite-react";
import validateDateTimePicker from '../../helper/dateValidation';
import CallerTableComponent from '../../components/callerTable/callerTable';
import { HiClock } from "react-icons/hi";
import CallerIdsPage from '../callerIds/callerIds';
import {
	getCallerIdsApiController,
	scheduleCallApiController,
	deleteCallerIdApiController,
	getScheduleApiController,
	deleteScheduleCallApiController
} from '../../utils/api/caller-ids.api';

export default function HomePage({isConnected}) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.user);
	const { upCommingSchedule = [] } = useSelector(state => state.callerId.scheduledData);
	const createCallerIdsStatus = useSelector(state => state.callerId.createCallerIdsStatus);
	const [isLoading, setIsLoading] = useState(false);
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
		const res = await getCallerIdsApiController();
		if (res.status !== 200) {
			showToast('error', 'Failed to get callIds');
			return;
		}
		const callerIds = res.data;
		if (callerIds.length) {
			dispatch(addCallerId([...callerIds]));
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
		console.log(isConnected, 'isConnected');
	}, [user]);

	useEffect(() => {
		if (createCallerIdsStatus?.status === 'success') {
			getCallerIds();
		}		
	}, [createCallerIdsStatus?.status, getCallerIds])

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
		setErrorMessage('');
		setIsLoading(true);
		try {
			const response = await scheduleCallApiController({ date, notes });

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
			return;
		}
		setIsTableLoading(false);
		dispatch(removeCallerId(ids));
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
									<div>
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
											upCommingSchedule.map(({ date, notes, scheduleName }, index) => <Timeline.Item key={`timeline-indx-${index + 1}`}>
												<Timeline.Point />
												<Timeline.Content>
													<Timeline.Time>{date}</Timeline.Time>
													<Timeline.Body>
														{notes}
													</Timeline.Body>
													<Button color="gray" onClick={() => deleteSchedule(scheduleName)}>
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
				<CallerIdsPage user={user}/>
			</div>
		</div>
	</>
}

