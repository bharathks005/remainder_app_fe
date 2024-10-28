import { Button, Card, Label, TextInput } from "flowbite-react";
import { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from '../../store/toastSlice';
import { addCallerId, removeCallerId } from '../../store/callerIdsSlice';
import classes from './home.module.scss';
import { Spinner } from "flowbite-react";
import validateDateTimePicker from '../../helper/dateValidation';
import CallerTableComponent from '../../components/callerTable/callerTable';
import { HiClock } from "react-icons/hi";
import CallerIdsPage from '../callerIds/callerIds';

import {
	getCallerIdsApiController,
	scheduleCallApiController,
	deleteCallerIdApiController
} from '../../utils/api/caller-ids.api';

export default function HomePage() {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.user);
	const [isLoading, setIsLoading] = useState(false);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const showToast = useCallback((type, message) => {
		dispatch(addToast({
			id: Date.now(),
			type,
			message
		}));
	}, [dispatch]);

	useEffect(() => {
		try {
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
			return () => {
				if (user?.approved) {
					getCallerIds();
				}
			}
		} catch (e) {
			console.error(e);
			showToast('error', 'Failed to get callIds');
		}
	}, [user, dispatch, showToast]);

	const scheduleCallHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const date = formData.get("dateAndTime");
		const validateDate = validateDateTimePicker(date);
		if (!validateDate.isValid) {
			setErrorMessage(validateDate.error);
			return;
		}
		setErrorMessage('');
		setIsLoading(true);
		try {
			const response = await scheduleCallApiController(date);
			if (response.status !== 200) {
				setIsLoading(false);
				showToast('error', 'Failed to schedule call');
				return;
			}
			showToast('success', 'Scheduled Call Successfully!!');
			setIsLoading(false);
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
	return <>
		{
			!user?.approved ? <Card className={`${classes.inactive} md:w-full`}>
				<h2 className={classes.title}>
					Please check with the administrator to request account approval.
				</h2>
			</Card> : <div className={classes.homeContainer}>
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
											<TextInput name="dateAndTime" id="dateAndTime" type="datetime-local" required
												color={errorMessage ? "failure" : ""}
												helperText={
													errorMessage ? <span className="font-medium" >{errorMessage}</span> : ""
												}
											/>
										</div>
										<Button type="submit" color="dark" className={classes.scheduleBtn} disabled={isLoading}>
											{
												isLoading ? <Spinner color="info" aria-label="loading state" /> : <span> <HiClock /> Schedule Call 	</span>}
										</Button>
									</form>
								</Card>
							</div>
							<div className="flex flex-col items-center justify-center w-full md:w-1/2">
								<CallerTableComponent isLoading={isTableLoading} deleteCallerIDHandler={deleteCallerId} />
							</div>
						</div>
					</div>
				}
				<div className={classes.register}>
					<CallerIdsPage />
				</div>
			</div>
		}

	</>
}

