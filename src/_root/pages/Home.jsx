import React from 'react'
import { Button } from '@/components/ui/button'

const Home = () => {
  return (
    <div className="bg-deafult flex gap-4 h-screen flex items-center justify-center gap-x-4">
        <div>
            <h1 className='text-6xl font-bold' style={{
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
            }}>Discourse</h1>
            <h1 className='text-4xl font-semibold'>Hangout Anywhere, Anytime</h1>
            <Button className='mt-4'>Start Chatting</Button>
            <Button variant='secondary' className='mt-4 ml-4'>Try as guest</Button>
        </div>
        <img src="/chatScreenshot1.png" className='w-auto h-[600px]'/>
        <img src="/chatScreenshot2.png" className='w-auto h-[600px]'/>
    </div>
  )
}

export default Home