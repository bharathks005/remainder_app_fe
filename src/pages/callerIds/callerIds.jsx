import { Button, Badge, Label, TextInput } from "flowbite-react";
import { HiMail, HiOutlinePhone } from "react-icons/hi";
import { useState } from "react";
import { Card } from "flowbite-react";
import classes from './callerIds.module.scss';
import { HiOutlineArrowLeft } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import { craeteCallerIdApiController } from '../../utils/api/caller-ids.api';
import { addToast } from '../../store/toastSlice';
import { useDispatch } from 'react-redux';

export default function CallerIdsPage() {
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [verificationCode, setVerificationCode] = useState("");
	const dispatch = useDispatch();

	const showToast = (type, message) => {
		dispatch(addToast({
			id: Date.now(),
			type,
			message
		}));
	};

	const formSubmitHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = {
			name: formData.get("friendly_name"),
			phone: `91${formData.get("phone_number")}`,
		};
		const phoneRegex = /^[6-9]\d{9}$/;
		const value = e.target.value;
		if (value && !phoneRegex.test(value)) {
			setErrorMessage("Please enter a valid Indian phone number.");
			return;
		}
		setErrorMessage('');
		try {
			setIsLoading(true);
			const res = await craeteCallerIdApiController(data);
			if (res.status !== 200) {
				setIsLoading(false);
				showToast('error', 'Failed to Create CallerID');
			}
			const { validationCode } = res.data;
			setIsLoading(false);
			if (validationCode) {
				setVerificationCode(validationCode);
			}
		} catch (e) {
			setIsLoading(false);
			console.error("Submission error:", e);
		}
	};

	return (
		<div className={`${classes.CallerIdsContainer} max-w-md mt-28`}>
			<h2 className="text-2xl font-bold mb-4">Register Caller ID</h2>
			<Card className="max-w-sm mt-5">
				{!verificationCode ? (
					<form
						className="flex max-w-md flex-col gap-4"
						onSubmit={formSubmitHandler}
					>
						<div className="max-w-md text-left">
							<div className="mb-2 block">
								<Label className="align-center" htmlFor="friendly_name" value="Friendly Name" />
							</div>
							<TextInput
								id="friendly_name"
								type="text"
								icon={HiMail}
								name="friendly_name"
								placeholder="Friendly Name"
								required
							/>
						</div>
						<div className="max-w-md">
							<div className="mb-2 block text-left">
								<Label htmlFor="phone_number" value="Phone Number" />
							</div>
							<TextInput
								id="phone_number"
								type="phone"
								name="phone_number"
								color={`${errorMessage.length ? "failure" : ""}`}
								icon={HiOutlinePhone}
								helperText={`${errorMessage.length ? errorMessage : ""}`}
								placeholder="+91 (999) 999-9999"
								required
							/>
						</div>
						<Button color="dark" type="submit" className={classes.submit}>{isLoading ? <Spinner color="info" aria-label="loading state" /> : 'Submit'}</Button>
					</form>
				) : (
					<>
						<div className={`${classes.action} max-w-md`}>
							<Button color="light" className={classes.backButton} onClick={() => {
								setVerificationCode(null);
							}}>
								<HiOutlineArrowLeft className="h-5 w-5" />
								<span className="ml-2">Back</span> </Button>
						</div>
						<div className={classes.mainSection}>
							<h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								You Will get a Call Soon!
							</h4>
							<h6 className={`${classes.helperText} text-sm tracking-tight text-gray-900 dark:text-white my-2`}>
								Please enter the Verification Code
							</h6>
							<Badge color="success" size="lg" className={classes.badge}>
								{verificationCode}
							</Badge>
							<span className="text-1xl font-bold">{ }</span>
						</div>
						<div className={classes.footer}>
							<Button color="dark" className={classes.retryBtn} onClick={() => {
								setVerificationCode(null);
							}}> Retry </Button>
						</div>
					</>
				)}
			</Card>
		</div>
	);
}
