import { useState } from "react";
import Image from './Image'

export default function PlaceGallery({place}) {
	const [showAllPhotos, setShowAllPhotos] = useState(false);
	
	if (showAllPhotos) {
		return(
			<div className="absolute inset-0">
				<div className="p-8 grid gap-4 bg-black/90 min-h-screen">
					<div>
						<h2 className="text-2xl text-white max-w-5xl mx-auto mb-4">Photos of {place.title}</h2>
						<button onClick={() => setShowAllPhotos(false)} className="right-12 top-8 fixed flex gap-2 py-2 px-4 rounded-2xl shadow shadow-black text-black">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
							</svg>
							Close photos
						</button>
					</div>
					{place?.photos?.length > 0 && place.photos.map(photo => (
						<div key={photo} className="object-cover">
							<Image className='max-w-5xl mx-auto max-h-[480px] object-fit' src={photo} alt="" />
						</div>
					))}
				</div>
			</div>
		);
	}

	return(
		<div>
			<div className="relative">
				<div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
					<div>
						{place.photos?.[0] && (
							<div>
								<Image onClick={() => setShowAllPhotos(true)} 
										 className="cursor-pointer aspect-square object-cover " 
										 src={place.photos[0]} 
										 alt="" 
										 style={{ objectFit: 'cover !important' }}/>
							</div>
						)}
					</div>
						<div className="grid">
							{place.photos?.[1] && (
								<Image onClick={() => setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover" src={place.photos[1]} alt="" />
							)}
							<div className="overflow-hidden">
								{place.photos?.[2] && (
									<Image onClick={() => setShowAllPhotos(true)} className="cursor-pointer aspect-square object-cover relative top-2 " src={place.photos[2]} alt="" />
								)}
							</div>
						</div>
				</div>
				<button onClick={() => setShowAllPhotos(true)} className="flex gap-2 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-gray-500 shadow-md border border-black ">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
						<path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
					</svg>
					See all photos
				</button>
			</div>
		</div>
	)
}