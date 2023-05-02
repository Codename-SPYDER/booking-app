import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
	const [help, setHelp] = useState(false);
	const {user} = useContext(UserContext);

	function toggleHelp() {
		setHelp(!help);
	}
  
	return(
		
	<header className='flex justify-between'>
		{help ? 
		(
  		<div className=" fixed w-full h-screen bg-primary/60 flex flex-col justify-center items-center z-20 top-0 left-0">
				<p className="overflow-y-auto bg-gray-100 mb-24 w-3/4 2xl:w-1/2 p-8 rounded-md xl:text-lg border-gray-400 border-2 max-[600px]:text-sm max-[600px]:p-3 max-[600px]:w-full max-[600px]:mb-10">
					Hi, welcome to my airbnb clone Webapp! <br/><br/> 
					You can browse and view property listings through the main page; however in order to book a stay you must first create an account. 
					You can login or create an account by clicking the profile icon in the top right where you will be directed to the login/register page.
					After logging in and then booking a stay you can view your booking in the My bookings section of your user account. 
					<br/><br/>You also have the option of adding properties that you will be hosting. To add a new property listing, click on the user icon, select My Accommodations, and then click on the 'Add New Place' button.
					If you have to make changes regarding your properties information,
					simply click on the listing from your My Accommodations page, change the information, and then resubmit it<br/><br/> 
					Please feel free to communicate any issues you face when using the application or improvements you would like to see through the Contact Me portion of my profile website.
					Thanks again for stopping by!
				</p>
    		<button onClick={toggleHelp} className="text-lg w-1/2 text-white py-2 rounded-full bg-primary border-white shadow-md hover:scale-95 ease-in-out duration-500">Back to Site</button>
  		</div>
		) : null}
		<Link to={'/'} className='flex items-center gap-1'>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 hidden sm:flex">
				<path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
			</svg>
			<span className='font-bold text-xl'>airbnb</span>
		</Link>
		<div className='hidden border border-gray-300 rounded-full py-2 px-4 gap-2 ml-12 shadow-md shadow-gray-300 md:flex'>
			<div>Anywhere</div>
			<div className="border-l border-grey-300"></div>
			<div>Any week</div>
			<div className="border-l border-grey-300"></div>
			<div>Add guests</div>
			<button className='bg-primary text-white p-1 rounded-full'>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
					<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
				</svg>
			</button>
		</div>
		<div className="flex items-center gap-4">
			<button onClick={toggleHelp}
			className="bg-gray-100 border-2 rounded-md border-gray-400 hover:scale-90 ease-in-out duration-300 p-0.5 mt-0.5">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  				<path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
				</svg>
			</button>
			<Link to={user ? '/account':'/login'} className='flex border items-center border-gray-300 rounded-full py-2 px-4 gap-2 '>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
				</svg>
				<div className='bg-gray-500 rounded-full text-white border border-gray-500 overflow-hidden hidden sm:flex'>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
						<path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
					</svg>
				</div>
					{!!user && (
						<div>
							{user.name}
						</div>
					)}
			</Link>
		</div>
	</header>
	);
}