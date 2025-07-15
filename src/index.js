import React from "react";
import { Provider } from 'react-redux';
import store from './store/store';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import ErrorPage from "./pages/error/error";
import LoginPage from './pages/login/login';
import RegisterCallerIdsPage from './pages/register-callerIds/register-callerIds';
import HomePage from './pages/home/home';
import AdminPage from './pages/admin/admin';

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "/admin", element: <AdminPage /> },
			{ path: "/register", element: <RegisterCallerIdsPage /> },
		],
	},
	{
		path: "/login",
		element: <LoginPage />,
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>,
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
