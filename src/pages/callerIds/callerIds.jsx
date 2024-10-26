import { Button, Label, TextInput } from "flowbite-react";
import { HiMail, HiOutlinePhone } from "react-icons/hi";
import { useState } from "react";
import { Card } from "flowbite-react";
import classes from './callerIds.module.scss';
import { HiOutlineArrowLeft, HiShoppingCart } from "react-icons/hi";

export default function CallerIdsPage() {
	const [errorMessage, setErrorMessage] = useState("");
	const [verificationCode, setVerificationCode] = useState("13");
	const handleInputChange = (e) => {
		const phoneRegex = /^[6-9]\d{9}$/;
		const value = e.target.value;
		if (value && !phoneRegex.test(value)) {
			setErrorMessage("Please enter a valid Indian phone number.");
		} else {
			setErrorMessage("");
		}
	};
	const formSubmitHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = {
			name: formData.get("friendly_name"),
			phone: `91${formData.get("phone_number")}`,
		};
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/caller-ids/createCallerIds`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			if (!response.ok) {
				throw new Error("form submission failed");
			}
			const res = await response.json();

			if (res.validationCode) {
				setVerificationCode(res.validationCode);
			}
		} catch (e) {
			console.error("Submission error:", e);
		}
	};

	return (
		<div className={`${classes.CallerIdsPage} max-w-md`}>
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
							onKeyUp={handleInputChange}
							helperText={`${errorMessage.length ? errorMessage : ""}`}
							placeholder="+91 (999) 999-9999"
							required
						/>
					</div>
					<Button type="submit">Submit</Button>
				</form>
			) : (
				<>

					<div className="max-w-md text-left">
						<Button color="light" className={classes.back} onClick={() => {
							setVerificationCode(null);
						}}>
							<HiOutlineArrowLeft className="ml-2 h-5 w-5" />
							<span className="ml-2">Back</span> </Button>
					</div>
					<Card className="max-w-sm">
						<h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							Verification Code
						</h5>
						<span className="text-1xl font-bold">{verificationCode}</span>
						<Button className={classes.retry} onClick={() => {
							setVerificationCode(null);
						}}> Retry </Button>
					</Card>

				</>
			)}
		</div>
	);
}
