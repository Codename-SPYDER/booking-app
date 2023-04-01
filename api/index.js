// Express & Dotenv Setup
const express = require('express');
const app = express();
const PORT = 4000;
require('dotenv').config();

// Dependencies
const imageDownloader = require('image-downloader');
const multer = require('multer');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const bucket = 'spyder-booking-app';
const fs = require('fs');
const cors = require('cors');
const mime = require('mime-types');

// Token & Cookie Setup
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const cookieParser = require('cookie-parser');

// Model Imports & Mongoose
const { default: mongoose, Promise } = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');

// Parse incoming string to json format
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Add a middleware function to handle OPTIONS requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://booking-app-req.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Enable CORS for specific origins
app.use(cors({
  origin: 'https://booking-app-req.vercel.app',
  credentials: true
}));

async function uploadToS3(path, originalFilename, mimetype) {
	const client = new S3Client({
		region: 'us-east-2',
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		}
	});
	const parts = originalFilename.split('.');
	const ext = parts[parts.length - 1];
	const newFilename = Date.now() + '.' + ext;
	await client.send(new PutObjectCommand({
		Bucket: bucket,
		Body: fs.readFileSync(path),
		Key:  newFilename,
		ContentType: mimetype,
		ACL: 'public-read',
	}));
	return `https://${bucket}.s3.amazonaws.com/${newFilename}`
}

function getUserDataFromReq(req) {
	return new Promise((resolve, reject) => {
		jwt.verify(req.cookies.token, jwtSecret, {}, async (err, cookieData) => {
			if (err) throw err;
			resolve(cookieData);
		});
	});
}

app.get('/api/test', (req,res) => {
	mongoose.connect(process.env.MONGO_URL);
	res.json('test ok');
});

app.post('/api/register', async (req,res) => {
	mongoose.connect(process.env.MONGO_URL);
	const {name, email, password} = req.body;
	try{
		{/* UserDoc = {
  	_id: new ObjectId(""),
  	name: '',
  	email: '',
  	password: 'hashed string',
  	__v: 0 
		} */}
		const userDoc = await User.create({
			name,
			email,
			password: bcrypt.hashSync(password, bcryptSalt),
		});
		res.json(userDoc);
	} 
	catch (e) {
	res.status(422).json(e);
	}
});


app.post('/api/login', async (req,res) => {
	mongoose.connect(process.env.MONGO_URL);
	const {email, password} = req.body;
	{/* UserDoc = {
  _id: new ObjectId(""),
  name: '',
  email: '',
  password: 'hashed string',
  __v: 0 
	} */} 
	// UserDoc = null: if no user email found;
	const userDoc = await User.findOne({email});
	//console.log(userDoc);
	if (!!userDoc) {
		// bcrypt.compareSync: checking entered password with hashed password
		// passOk = boolean;
		const passOk = bcrypt.compareSync(password, userDoc.password);
		//console.log(passOk);
		if (passOk) {
			// jwt.sign(payload, secretOrPrivateKey, options, callback); 
			// jwt.sign: generates token
			jwt.sign({
				email:userDoc.email, 
				id:userDoc._id}, jwtSecret, {}, (err, token) => {
				if (err) throw err;
				// res.cookie: method provided by cookie-parser middleware
				// res.cookie: to create cookies and send in response
				// console.log(req.cookies): to read cookies from request
				res.cookie('token', token).json(userDoc);
			}); 
		} else {
			res.status(422).json('pass not ok');
		}
	}
});

app.get('/api/profile', (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	//deconstructing token from request cookie
	const {token} = req.cookies;
	//console.log(token);
	if (token) {
		jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
			if (err) throw err;
			const {name,email,_id} = await User.findById(cookieData.id);
			res.json({name,email,_id});
		});
	} else {
		res.json(null);
	}
});


app.post('/api/logout', (req, res) => {
	res.cookie('token', '').json(true);
});

// Images added by link will be prefixed with 'photo'
app.post('/api/upload-by-link', async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const {link} = req.body;
	const newName = 'photo' + Date.now() + '.jpg';
	try {
		await imageDownloader.image({
			url:link,
			dest:'/tmp/' + newName,
		});
		const url = await uploadToS3('/tmp/' + newName, newName, mime.lookup());
		//console.log('Image downloaded successfully');
		res.json(url)
	} catch (err) {
		//console.log('Error downloading image')
		res.status(400).json(err);
	}
});

// Images added by upload will have original filename
const photosMiddleware = multer({dest:'/tmp'});
app.post('/api/upload', photosMiddleware.array('photos',100) ,async (req, res) => {
	const uploadedFiles = [];
	for (let i = 0; i < req.files.length; i++) {
		const {path, originalname, mimetype} = req.files[i];
		const url = await uploadToS3(path, originalname, mimetype)
		uploadedFiles.push(url);
		//const parts = originalname.split('.');
		//const ext = parts[parts.length - 1];
		//const newPath = path + '.' + ext;
		//fs.renameSync(path, newPath);
		//uploadedFiles.push(newPath.replace('uploads/',''));
	}
	res.json(uploadedFiles);
})

app.post('/api/places', (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const {token} = req.cookies;
	const {title, 
				 address, 
				 addedPhotos, 
				 description,
				 perks,
				 extraInfo,
				 checkIn,
				 checkOut,
				 maxGuests,
				 price,} = req.body;
	jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
		if (err) throw err;
		const placeDoc = await Place.create({
			owner:cookieData.id,
			title, 
			address, 
			photos:addedPhotos, 
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuests,
			price,
		});
		res.json(placeDoc);
	});	
})

app.get('/api/user-places', (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const {token} = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
		const {id} = cookieData;
		res.json(await Place.find({owner:id}) );
	});   
})

app.get('/api/places/:id', async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const {id} = req.params;
	res.json(await Place.findById(id));
})

app.put('/api/places', async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const {token} = req.cookies;
	const {id,
				 title, 
				 address, 
				 addedPhotos, 
				 description,
				 perks,
				 extraInfo,
				 checkIn,
				 checkOut,
				 maxGuests,
				 price,} = req.body;
	jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
		if (err) throw err;
		const placeDoc = await Place.findById(id);
		if (cookieData.id === placeDoc.owner.toString()) {
			placeDoc.set({title, 
										address, 
										photos:addedPhotos, 
										description,
										perks,
										extraInfo,
										checkIn,
										checkOut,
										maxGuests,
										price,});
			await placeDoc.save();
			res.json('ok');
		}
	});
})

app.get('/api/places', async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	res.json(await Place.find());
})

app.post('/api/bookings', async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const userData = await getUserDataFromReq(req);
	const {
		place, 
		checkIn, 
		checkOut, 
		numberofGuests, 
		name, 
		phone,
		price,
	} = req.body;
	Booking.create({
		place, 
		checkIn, 
		checkOut, 
		numberofGuests, 
		name, 
		phone,
		price,
		user:userData.id,
	}).then((doc) => {
		res.json(doc);
	}).catch((err) => {
		throw err;
	});
})



app.get('/api/bookings', async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const userData = await getUserDataFromReq(req);
	res.json(await Booking.find({user:userData.id}).populate('place'));
})


app.listen(PORT, () => console.log(`Listening for request...`));
