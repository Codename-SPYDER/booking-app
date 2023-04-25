import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import Image from '../Image'

export default function PlacePage() {
	const {id} = useParams();
	const [place, setPlace] = useState(null);
	//const [showAllPhotos, setShowAllPhotos] = useState(false);
	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get(`/places/${id}`).then(response => {
			setPlace(response.data);
		});
	}, [id]);

	console.log(place);
	function timeFormat(dateString) {
		const date = new Date();
		date.setHours(parseInt(dateString.split(":")[0]));
		date.setMinutes(parseInt(dateString.split(":")[1]));
		return date.toLocaleTimeString('en-US', {hour12: true, hour:'numeric', minute: 'numeric'});
	}

	if (!place) return '';

	//if (showAllPhotos) {
	//	return(
	//		<div className="absolute inset-0">
	//			<div className="p-8 grid gap-4 bg-black">
	//				<div>
	//					<h2 className="text-2xl text-white mb-4">Photos of {place.title}</h2>
	//					<button onClick={() => setShowAllPhotos(false)} className="right-12 top-24 fixed flex gap-2 py-2 px-4 rounded-2xl shadow shadow-black">
	//						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
	//							<path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
	//						</svg>
	//						Close photos
	//					</button>
	//				</div>
	//				{place?.photos?.length > 0 && place.photos.map(photo => (
	//					<div className="">
	//						<Image src={photo} alt="" />
	//					</div>
	//				))}
	//			</div>
	//		</div>
	//	);
	//}
	return(
		<div className="mt-4 bg-gray-100 -mx-8 px-16 pt-8 min-h-screen">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-2xl">
					{place.title}
				</h1>
				<AddressLink>{place.address}</AddressLink>
				<PlaceGallery place={place}/>
				<div className="grid gap-11 grid-cols-1 md:grid-cols-[2fr_1fr] mt-14 mb-10">
					<div>
						<div className="my-4">
							<h2 className="font-semibold text-2xl">Description</h2>
							{place.description}
						</div>
						<strong>Check-in:</strong> {timeFormat(place.checkIn)} <br />
						<strong>Check-out:</strong> {timeFormat(place.checkOut)} <br />
						<strong>Max guests:</strong> {place.maxGuests}
						{place.perks && (
							<div className="mt-4 mb-1 font-bold">Perks:</div>
						)}
						{place.perks && place.perks.map(perk => (
							<div className="flex items-center gap-2">
								<div className="bg-black/60 w-1.5 h-1.5 rounded-full"/>
								<div className="capitalize">{perk}</div>
							</div>
							
						))}
					</div>
					<div>
						<BookingWidget place={place}/>
					</div>
				</div>
				<div className="bg-white -mx-8 p-8 border-t mb-10 border rounded-sm">
					<div>
						<h2 className="text-2xl font-semibold">
							Extra Info
						</h2>
					</div>
					<div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
						{place.extraInfo}
					</div>
				</div> 
			</div>
		</div>
	);
}