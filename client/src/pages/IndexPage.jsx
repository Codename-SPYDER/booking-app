import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from '../Image';

export default function IndexPage() {
	const [places, setPlaces] = useState([]);
	useEffect(() => {
		axios.get('/places').then(response => {
			setPlaces(response.data);
		})
	}, []);

	return(
		<div className="mt-8 px-14 gap-x-7 gap-y-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{places.length > 0 && places.map(place => (
				<Link key={place._id} to={'/place/' + place._id}>
					<div className="bg-gray-500 rounded-2xl flex mb-2">
						{place.photos?.[0] && (
							<Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt="" />
						)}
					</div>
					<h2 className="font-bold truncate">{place.address}</h2>
					<h3 className="text-sm text-gray-500 line-clamp-2 h-10">{place.title}</h3>
					<div className="mt-1">
						<span className="font-bold">${place.price}</span> per night 
					</div>
				</Link>
			))}
		</div>
	);
}