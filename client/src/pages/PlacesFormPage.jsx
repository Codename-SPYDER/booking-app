import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
	// useParams(): is a hook that allows you to access the different sections of the url
	const {id} = useParams();
	const [title, setTitle] = useState('');
	const [address, setAddress] = useState('');
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [description, setDescription] = useState('');
	const [perks, setPerks] = useState([]);
	const [extraInfo, setExtraInfo] = useState('');
	const [checkIn, setCheckIn] = useState('');
	const [checkOut, setCheckOut] = useState('');
	const [maxGuests, setMaxGuests] = useState(1);
	const [price, setPrice] = useState(100);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		if (!id) {
			// return: since nothing is returned, return exits the function rather then be executed on dismount
			return;
		}
		axios.get('/places/' + id).then(response => {
			const {data} = response;
			setTitle(data.title);
			setAddress(data.address);
			setAddedPhotos(data.photos);
			setDescription(data.description);
			setPerks(data.perks);
			setExtraInfo(data.extraInfo);
			setCheckIn(data.checkIn);
			setCheckOut(data.checkOut);
			setMaxGuests(data.maxGuests);
			setPrice(data.price);
		})
	}, [id]);

	function inputHeader(text) {
		return(
			<h2 className="text-2xl mt-4 ">{text}</h2>
		)
	}
	
	function inputDescription(text) {
		return(
			<p className="text-gray-500 text-sm">{text}</p>
		)
	}

	// Format reusable header and description for all inputs
	function preInput(header, description) {
		return(
			<>
				{inputHeader(header)}
				{inputDescription(description)}
			</>
		)
	}

	async function savePlace(ev) {
		ev.preventDefault();
		const placeData = {
			title, 
			address, 
			addedPhotos, 
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuests,
			price,
		};
		if (id) {
			//update
			await axios.put('/places', {
				id, ...placeData
				});
			setRedirect(true);

		}   else {
			//new place
			await axios.post('/places', placeData);
			setRedirect(true);
		}
		
	}

	if (redirect) {
		return <Navigate to={'/account/places'}/>
	}

	return(
		<>
			<div>
				<AccountNav />
				<form onSubmit={savePlace}>
					{preInput('Title','Title for your listing, should be short and sweet')}
					<input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apt"/>
					{preInput('Address','Address for this listing')}
					<input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
					{preInput('Photos','Show us your listing')}
					<PhotosUploader addedPhotos={addedPhotos} changePhotoArray={setAddedPhotos}/>
					{preInput('Description','Please describe your listing below')}
					<textarea value={description} onChange={ev => setDescription(ev.target.value)}/>
					{preInput('Perks','Select all the prerks of your listing')}
					<div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
						<Perks selected={perks} changePerkArray={setPerks} />
					</div>
					{preInput('Extra info','house rules, etc')}
					<textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>
					{preInput('Check in & out time','add check in and out times')}
					<div className="grid gap-2 grid-cols-2 md:grid-cols-4 mb-4">
						<div className="">
							<h3 className="ml-1 mt-2 mb-.5">Check in time</h3>
							<input type="time" 
								   value={checkIn} 
								   onChange={ev =>  setCheckIn(ev.target.value)} 
								   />
						</div>
						<div className="">
							<h3 className="ml-1 mt-2 mb-.5">Check out time</h3>
							<input type="time" 
								   value={checkOut} 
								   onChange={ev => setCheckOut(ev.target.value)} 
								   />
						</div>
						<div className="">
							<h3 className="ml-1 mt-2 mb-.5">Max guests</h3>
							<input type="number" 
								   value={maxGuests} 
								   onChange={ev => setMaxGuests(ev.target.value)} />
						</div>
						<div className="">
							<h3 className="ml-1 mt-2 mb-.5">Price for night</h3>
							<input type="number" 
								   value={price} 
								   onChange={ev => setPrice(ev.target.value)} />
						</div>
					</div>
						<button className="primary my-7">Save</button>
				</form>
			</div>
		</>
	);
}