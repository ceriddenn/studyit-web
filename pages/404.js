import React from 'react'
import Header from '../components/Header'
const Custom404 = () => {
  return (
    <div className=''>
        <div>
        <section class="flex items-center h-full p-16 bg-gray-900 text-gray-100 h-screen">
	<div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
		<div class="max-w-md text-center">
			<h2 class="mb-8 font-extrabold text-9xl text-gray-600">
				<span class="sr-only">Error</span>404
			</h2>
			<p class="text-2xl font-semibold md:text-3xl">Looks like you found the great doorway to nothing!</p>
			<p class="mt-4 mb-8 text-gray-400">Just joking, but really... we have no idea what this page is.</p>
			<a rel="noopener noreferrer" href="/" class="px-8 py-3 font-semibold rounded bg-yellow-400 text-gray-900">Back to homepage</a>
		</div>
	</div>
</section>
        </div>
    </div>
  )
}

export default Custom404