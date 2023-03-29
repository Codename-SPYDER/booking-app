import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	async function registerUser(ev) {
		ev.preventDefault();
		try{
			await axios.post('/register', {
				name,
				email,
				password,
			});
			alert('Registration successful. Now you can log in');
		}
		catch (e) {
		alert('Registration failed. Please try again later');
		}
		
	}
	return(
		<div className="mt-4 grow flex items-center justify-around">
			<div className="mb-64">
				<h1 className="text-4xl text-center mb-4">Register</h1>
				<form className="max-w-md mx-auto" onSubmit={registerUser}>
					<input type='text' placeholder='John Doe'
						   value={name}
						   onChange={ev => setName(ev.target.value)} />
					<input type='email' placeholder='your@email.com'
						   value={email}
						   onChange={ev => setEmail(ev.target.value)} />
					<input type='password' placeholder='password'
						   value={password}
						   onChange={ev => setPassword(ev.target.value)} />
					<button className="primary">Register</button>
					<div className="py-2 text-center text-gray-500">
						All ready a member? <Link to={'/login'} className="underline text-black">Login</Link>
					</div>
				</form>
			</div>  
		</div>
	)
}