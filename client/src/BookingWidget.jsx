import { differenceInCalendarDays } from "date-fns";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({place}) {
	const [checkIn, setCheckIn] = useState('');
	const [checkOut, setCheckOut] = useState('');
	const [numberofGuests, setNumberOfGuests] = useState(1);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [redirect, setRedirect] = useState('');
	const {user} = useContext(UserContext);
	
	useEffect(() => {
		if (user) {
			setName(user.name);
		}
	}, [user]);

	let numberOfNights = 0;
	if (checkIn && checkOut) {
		numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
	}

	async function bookThisPlace() {
		if (!user) {
			alert("Please log in to book your experience");
		}
		else {
			try{
				if (!checkIn || !checkOut || !numberofGuests || !name || !phone) {
					alert('Please fill out all fields');
					return;
				} else {
					const response = await axios.post('/bookings', {
						place:place._id,
						checkIn, 
						checkOut, 
						numberofGuests, 
						name, 
						phone, 
						price:numberOfNights * place.price,
					});
					const bookingId = response.data._id;
					setRedirect(`/account/bookings/${bookingId}`);
				}
			}
			catch (err) {
				alert("Please log in to book your experience");
			}
		}
		
		
	}

	if (redirect) {
		return <Navigate to={redirect}/>
	}
	return(
		<div className="bg-white shadow p-4 rounded-2xl">
			<div className="text-2xl text-center">
				Price: ${place.price} / per night
			</div>
			<div className="border rounded-2xl mt-4">
				<div className="flex">
					<div className=" py-3 px-4">
						<label>Check in:</label>
						<input type="date" 
							   value={checkIn} 
							   onChange={ev => setCheckIn(ev.target.value)}/>
					</div>
					<div className="border-l py-3 px-4">
						<label>Check out:</label>
						<input type="date" 
							   value={checkOut} 
							   onChange={ev => setCheckOut(ev.target.value)}/>
					</div>
				</div>
				<div className=" border-t py-3 px-4">
					<label>Number of guests:</label>
					<input type="number" 
						   value={numberofGuests} 
						   onChange={ev => setNumberOfGuests(ev.target.value)}/>
				</div>
				{numberOfNights > 0 && (
					<div className=" border-t py-3 px-4">
						<label>Name:</label>
						<input type="text" 
							   value={name} 
							   onChange={ev => setName(ev.target.value)}/>
						<label>Phone number:</label>
						<input type="tel" 
							   value={phone} 
							   onChange={ev => setPhone(ev.target.value)}/>
					</div>
				)}
			</div>
			<div className="mt-4">
				<button onClick={bookThisPlace} className="primary">
					Book now
					{numberOfNights > 0 && (
						<span> ${numberOfNights * place.price}</span>
					)}
				</button>
			</div>
		</div>
	);
}