import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { useSearchParams } from 'react-router-dom';
import classes from './register-callerIds.module.scss';
import { Select, Button, Badge, Label, TextInput } from "flowbite-react";
import { HiOutlinePhone, HiOutlineArrowLeft, HiOutlineDocumentDuplicate } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import { inviteCallersApiController, createCallerIdApiController } from '../../utils/api/caller-ids.api';
import { addToast } from '../../store/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { TabItem, Tabs } from "flowbite-react";
import { getEnumsApiController } from "../../utils/api/enum.api";
const { resetCreateCallerIdsStatus } = require('../../store/callerIdsSlice');



export default function RegisterCallerIdsPage() {
	const [errorMessage, setErrorMessage] = useState({
		phone: "",
		displayName: ""
	});
	const [isLoading, setIsLoading] = useState(false);	
	const areasEnums = useSelector(state => state.enum.areas);
	const [verificationCode, setVerificationCode] = useState("");
	const { status = '', message = '' } = useSelector(state => state.callerId.createCallerIdsStatus);
	const user = useSelector(state => state.user.user);
	const [inputValue, setInputValue] = useState("");
	const [inviteMessage, setInviteMessage] = useState("");
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();	

	const showToast = (type, message) => {
		dispatch(addToast({
			id: Date.now(),
			type,
			message
		}));
	};

	const validateName = (name) => {

		if (!name.trim()) {
			return "Name is required.";
		}
		// if (!/^[a-zA-Z\s]+$/.test(name)) {
		// 	return "Name can only contain letters and spaces.";
		// }
		if (name.length < 3) {
			return "Name must be at least 3 characters long.";
		}
		return "";
	};

	const validateForm = (data) => {
		let isValidForm = true;
		const phoneRegex = /^[6-9]\d{9}$/;
		const phone = data.phone;
		const displayName = data.displayName;
		const errorData = errorMessage;

		if (!phone || !displayName) {
			isValidForm = false;
		}

		if (!phoneRegex.test(phone)) {
			errorData.phone = "Please enter a valid Indian phone number.";
			isValidForm = false;
		} else {
			errorData.phone = "";
		}
		const nameError = validateName(displayName || '');
		if (nameError.length) {
			errorData.displayName = nameError;
			isValidForm = false;
		} else {
			errorData.displayName = "";
		}
		setErrorMessage({
			...errorData
		});
		return isValidForm;
	}

	const formSubmitHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = {
			name: user?.name || '',
			phone: formData.get("phone_number"),
			displayName: formData.get("display_name"),
			area: formData.get("area"),
			id: searchParams.get('id') || ''
		};
		const formValue = data;
		const isValid = validateForm(formValue);
		if (!isValid) {
			return;
		}
		try {
			setIsLoading(true);
			data.phone = `+91${data.phone}`;
			const res = await createCallerIdApiController(data);
			if (res.status !== 200) {
				setIsLoading(false);
				if (res.status == 409) {
					const error = errorMessage;
					error.displayName = 'Name is already used';
					setErrorMessage(error);
				} if (res.status === 400) {
					showToast('error', 'Expired Link. Contact Admin');
				} else if (res.status === 404) {
					showToast('error', 'Invalid Request Token not Found');
				} else {
					showToast('error', 'Failed to Create CallerID');
				}
				return;

			}
			const { validationCode } = res.data;
			if (validationCode) {
				setVerificationCode(validationCode);
			}
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			showToast('error', 'Failed to Create CallerID');
			console.error("Submission error:", e);
		}
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(inputValue);
			setInviteMessage("Copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy: ", err);
			setInviteMessage("Failed to copy!");
		}

		// Clear message after 2 seconds
		setTimeout(() => setInviteMessage(""), 2000);
	};

	const inviteCallersHandler = async (e) => {
		try {
			setIsLoading(true);
			const res = await inviteCallersApiController();
			if (res.status !== 200) {
				showToast('error', 'Failed to get invite');
				setIsLoading(false);
				return;
			}
			const link = res.data;
			setIsLoading(false);
			setInputValue(link);
		} catch (e) {
			setIsLoading(false);
			showToast('error', 'Failed to get invite');
			console.error("Submission error:", e);
		}
	}

	return (
		<div className={`${classes.form} w-full`}>
			{
				user.admin && <div className={`mt-28 max-w-md ${classes.inviteUsers}`}>
					<h2 className="text-2xl font-bold mb-4">Invite Callers</h2>
					<Card className="mt-5 max-w-md">
						<div className={classes.retry}>
							{inputValue.length ? <Button color="dark" className={classes.retryBtn} onClick={() => setInputValue('')}>
								Retry
							</Button> : <></>
							}
						</div>
						<div className={classes.inviteInput}>
							<div className="text-left max-w-md">
								<div className="mb-2 block">
									<Label className="align-center" htmlFor="invite_url" value="Invite Link" />
								</div>
								<TextInput
									value={inputValue}
									id="invite_url"
									type="text"
									name="invite_url"
									placeholder=""
									readOnly
								/>
							</div>
						</div>
						{inputValue ? <Button color="gray" className={classes.copyBtn} onClick={handleCopy}>
							<HiOutlineDocumentDuplicate />
							<span> Copy</span>
						</Button> :
							<Button color="dark" onClick={inviteCallersHandler} className={classes.inviteBtn}>{isLoading ? <Spinner color="info" aria-label="loading state" /> : 'Invite'}</Button>}
						{inviteMessage && <p className={classes.inviteMessage}>{inviteMessage}</p>}
					</Card>
				</div>
			}
			<div className={`${classes.CallerIdsContainer} mt-28 max-w-md`}>
				<h2 className="text-2xl font-bold mb-4">Register Caller ID</h2>
				<Card className="mt-5 max-w-md">
					{!verificationCode ? (
						<form
							className={`${isLoading ? classes.pending : ''} flex flex-col gap-4`}
							onSubmit={formSubmitHandler}
						>
							<div className="text-left max-w-md">
								<div className="mb-2 block">
									<Label className="align-center" htmlFor="display_name" value="Display Name" />
								</div>
								<TextInput
									id="display_name"
									type="text"
									name="display_name"
									placeholder="Display Name"
									color={errorMessage['displayName'] ? "failure" : ""}
									helperText={`${errorMessage['displayName'] ? errorMessage['displayName'] : ""}`}
									required
								/>
							</div>
							<div className="max-w-md">
								<div className="mb-2 block">
									<Label htmlFor="area" value="Select Your Area" />
								</div>
								<Select id="area" name="area" required>
									<option value="">default</option>
									{
										areasEnums.map(({ name }) => (
                                            <option value={name} key={name}>{name}</option>
                                        ))
									}
								</Select>
							</div>
							<div className="max-w-md">
								<div className="mb-2 block text-left">
									<Label htmlFor="phone_number" value="Phone Number" />
								</div>
								<TextInput
									id="phone_number"
									type="phone"
									name="phone_number"
									color={errorMessage['phone'] ? "failure" : ""}
									icon={HiOutlinePhone}
									helperText={`${errorMessage['phone'] ? errorMessage['phone'] : ""}`}
									placeholder="+91 (999) 999-9999"
									required
								/>
							</div>
							<Button color="dark" type="submit" className={classes.submit}>{isLoading ? <Spinner color="info" aria-label="loading state" /> : 'Register'}</Button>
						</form>

					) : (
						<>
							{

								<div className={`${classes.action} max-w-md`}>
									<Button color="light" className={classes.backButton} onClick={() => {
										setVerificationCode(null);
										dispatch(resetCreateCallerIdsStatus(null));

									}}>
										<HiOutlineArrowLeft className="h-5 w-5" />
										<span className="ml-2">Back</span> </Button>
								</div>
							}

							<div className={classes.mainSection}>
								{
									status === 'success' &&
									<h6 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
										Caller Id added successfully! Thank You!
									</h6>
								}
								{
									status === 'failed' && <>
										<h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
											Please Try again!
										</h4>
										{
											message === 'no-answer' && <h6 className={`${classes.helperText} text-sm tracking-tight text-gray-900 dark:text-white my-2`}>
												User not answer the call.
											</h6>
										}
									</>
								}
								{
									status === 'pending' && <>
										<h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
											You Will get a Call Soon!
										</h4>
										<h6 className={`${classes.helperText} text-sm tracking-tight text-gray-900 dark:text-white my-2`}>
											Please enter the Verification Code
										</h6>
										<Badge color="success" size="lg" className={classes.badge}>
											{verificationCode}
										</Badge>
									</>

								}
							</div>
							{
								status === 'failed' && <div className={classes.footer}>
									<Button color="dark" className={classes.retryBtn} onClick={() => {
										dispatch(resetCreateCallerIdsStatus(null));
										setVerificationCode(null);
									}}> Retry </Button>
								</div>
							}

						</>
					)}
				</Card>
			</div >
		</div>
	);
}
