import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
	const [user, setUser] = useState(null);
	const [ready, setReady] = useState(false);
	//console.log(user);
	//console.log(ready);
	
	{/* useEffect(() => {
		console.log("Component Mounted");

		return() => {
			console.log("Component has been dropped");
		}
	}, []); */}

	// If user = null;, user's information will be reretrieved
	// exhibited during refresh after leaving login page
	useEffect(() => {
		if (!user) {
			try{
				axios.get('/profile').then(({data}) => {
					//console.log(data);
					if (data) {
						setUser(data);
						setReady(true);
					}	
				});
			} catch (e) {
				alert('Cookie not verified - Please reload page')
			}
		}
	}, []);

	return(
		<UserContext.Provider value={{user, setUser, ready, setReady}}>
			{children}
		</UserContext.Provider>
	);
}