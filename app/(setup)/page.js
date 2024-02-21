"use client";
import { redirect } from 'next/navigation'
import React from 'react'
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  return (
    <div>
      <button className='bg-white text-black' 
      onClick={()=> router.push("/user-setup")}>Sign-in</button>
    </div>
  )
}

export default HomePage