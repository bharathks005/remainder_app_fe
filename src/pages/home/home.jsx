import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { List, Avatar } from "flowbite-react";
import classes from './home.module.scss';
import { Spinner } from "flowbite-react";


export default function CallerIdsPage() {
	const [outgoingCallerIds, setOutgoingCallerIds] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		try {
			const getCallerIds = async () => {
				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/api/caller-ids/getOutgoingCallerIds`
				);
				if (!response.ok) {
					throw new Error("form submission failed");
				}
				const res = await response.json();
				if (res.length) {
					setOutgoingCallerIds(res);
				}

			}
			if (!outgoingCallerIds.length) {
				getCallerIds();
			}
		} catch (e) {
			console.error("Submission error:", e);
		}
	}, []);

	const syncCallerIds = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/caller-ids/syncOutgoingCallerIds`
			);
			if (!response.ok) {
				throw new Error("failed");
			}
			const res = await response.json();
			if (res.length) {
				setOutgoingCallerIds(res);
			}
		} catch (e) {
			console.error("Submission error:", e);
		}
	}

	const createCall = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = {
			date: formData.get("dateAndTime"),
		};
		try {
			setIsLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/schedule-call/create`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			if (!response.ok) {
				setIsLoading(false);
				throw new Error("failed");
			}
			const res = await response.json();
			alert('done');
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
			console.error("Submission error:", e);
		}
	}
	return <>
		<div className={classes.resync}>
			<Button onClick={syncCallerIds}>
				Re-Sync
			</Button>
		</div>
		<div className={`${classes.home} flex flex-row items-center justify-between min-h-screen py-2`}>
			<div className="flex flex-col justify-center w-full md:w-1/2">
				<Card className="max-w-md">
					<form className="flex flex-col gap-4" onSubmit={createCall}>
						<div>
							<div className="mb-2 block text-left">
								<Label htmlFor="dateAndTime" value="Date And Time" />
							</div>
							<TextInput name="dateAndTime" id="dateAndTime" type="datetime-local" placeholder="name@flowbite.com" required />
						</div>
						<Button type="submit" disabled={isLoading}> {isLoading ? <Spinner color="info" aria-label="Info spinner example" /> : 'Schedule Call'}</Button>
					</form>
				</Card>
			</div>
			<div className="flex flex-col items-center justify-center w-full md:w-1/2">
				<Card className="w-full">
					<List unstyled className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
						{
							outgoingCallerIds.map((item, index) => (
								<List.Item className="pb-3 sm:pb-4" key={`item-${index}`}>
									<div className="flex items-center space-x-4 rtl:space-x-reverse">
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.friendlyName}</p>
											<p className="truncate text-sm text-gray-500 dark:text-gray-400">{item.sid}</p>
										</div>
										<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{item.phoneNumber}</div>
									</div>
								</List.Item>
							))
						}
					</List>
				</Card>
			</div>
		</div>
	</>
}
