import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";
import PlaceImg from "../PlaceImg";
import AccountNav from "./AccountNav";

export default function BookingsPage() {
	const [bookings,setBookings] = useState([]);

	useEffect(() => {
		axios.get('/bookings').then(response => {
			setBookings(response.data);
		});
	}, []);
  
	return(
		<div>
			<AccountNav />
			<div>
				{bookings?.length > 0 && bookings.map(booking => (
					<Link key={booking._id} to={`/account/bookings/${booking._id}`} className="cursor-pointer flex gap-4 bg-gray-100 p-4 rounded-2xl">
						<div className="my-auto flex w-32 h-32 bg-gray-300">
							<PlaceImg place={booking.place} />
						</div>
						<div className="py-3 pr-3 grow">
							<h2 className="text-xl">{booking.place.title}</h2>
		
							<div className="">
								<BookingDates className="mb-2 mt-4 text-gray-500" booking={booking}/>
								<div className="flex gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 pt-1">
										<path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
										<path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
									</svg>
									<span className="text-lg">
										Total price: ${booking.price}
									</span>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}