"use client";
import React from 'react'
import Link from 'next/link';


const HomePage = () => {

  return (
    <div>
      <div className="flex flex-col min-h-screen">

    <div className='flex items-center justify-center px-12 py-6 '>
    <header className=" flex justify-between items-center px-4 py-6 w-full text-lg">
          <h1 className="text-3xl font-bold text-white">UniVibe</h1>
          <nav className="space-x-4 text-gray-400">
            <Link href="/user-setup" className=" hover:text-gray-300">Sign In</Link>
            <Link href="#" className="hover:text-gray-300">Contact</Link>
          </nav>
      </header>
    </div>
      <main className="px-4 py-8 flex flex-col items-center justify-center">
        <img src='/images/logo.png' className='w-72 h-72 invert'/>
        <h2 className="text-3xl font-bold m-12 text-gray-400">The only college social network app that you need.</h2>
        <Link href="/user-setup" className="bg-white text-black font-bold py-2 px-8 rounded-md shadow-md hover:scale-110 transition h-fit w-fit text-xl">Get the experience now</Link>
      </main>

      <footer className="text-center py-4 text-white">
        <p>&copy; 2024 UniVibe</p>
      </footer>
    </div>
    </div>
  )
}

export default HomePage

