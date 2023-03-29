import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "./AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";


export default function PlacesPage() {
	const [places, setPlaces] = useState([]);
	useEffect(() => {
		axios.get('/user-places').then(({data}) => {
			setPlaces(data);
		});
	}, []);
  
	return(
		<div>
			<AccountNav/>
				<div className="text-center mb-4">
					<Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 mr-14 rounded-full" to={'/account/places/new'}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>

						Add new place
					</Link>
				</div>
				<div className="">
					{places.length > 0 && places.map(place => (
						<Link key={place._id} to={"/account/places/"+ place._id} className=" cursor-pointer flex gap-4 bg-gray-100 p-4 rounded-2xl">
							<div className="my-auto flex w-32 h-32 bg-gray-300 shrink-0">
								<PlaceImg place={place} />
							</div>
							<div className="px-2 py-3 pr-3 grow">
								<h2 className="text-xl line-clamp-1">{place.title}</h2>
								<p className="text-sm mt-2 line-clamp-4">{place.description}</p>
							</div>
						</Link>
					))}
				</div>
		</div>
	);
}