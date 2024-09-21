import type { ReactElement } from 'react'

export default function GalleryPage(): ReactElement {
	return (
		<div className='m-2 grid min-h-screen grid-cols-[minmax(0,384px)] place-content-center gap-2 md:m-0 md:grid-cols-[repeat(2,minmax(0,384px))] xl:grid-cols-[repeat(3,384px)]'>
			<h1> Pages/Gallery</h1>
		</div>
	)
}
