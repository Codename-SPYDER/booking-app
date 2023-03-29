import { Outlet } from "react-router-dom";
// Outlet: renders child route elements according to route chosen by <Routes>

import Header from "./Header";

export default function Layout () {
	return (
		//Stack components vertically with flex-col flex 
		<div className='pt-6 px-8 flex-col flex min-h-screen'>
			<Header />
			<Outlet />
		</div>
	)
}