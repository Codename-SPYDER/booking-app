import axios from "axios";
import { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import AccountNav from "./AccountNav";
import PlacesPage from "./PlacesPage";

export default function ProfilePage() {
	const [redirect, setRedirect] = useState(null);
	const {ready, user, setUser} = useContext(UserContext);

	let {subpage} = useParams();

	if (subpage === undefined) {
		subpage = 'profile';
	}

	async function logout() {
		await axios.post('/logout');
		setRedirect('/');
		setUser(null);
	}

	if (!ready) {
		return 'Loading...';
	}

	if (ready && !user && !redirect) {
		return <Navigate to={'/login'} />
	}

	if (redirect) {
		return <Navigate to={redirect} />
	}

	return(
		<div>
			<AccountNav />
			{subpage === 'profile' && (
				<div className="text-center max-w-lg mx-auto">
					<div className="mr-12">Logged in as {user.name} ({user.email})</div>
					<button onClick={logout} className="primary max-w-sm mt-2 mr-12">Logout</button>
				</div>
			)}
			{subpage === 'places' && (
				<div>
					<PlacesPage />
				</div>
			)}
		</div>
	);
}