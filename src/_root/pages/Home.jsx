import React from 'react'
import { Button } from '@/components/ui/button'
import { NavLink } from 'react-router-dom'
import apiClient from '@/services/apiClient'
import { jwtDecode } from 'jwt-decode'
import {useContext} from 'react'
import AuthContext from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  let navigate = useNavigate()

  let {user, setUser, setAuthTokens} = useContext(AuthContext)

  const handleGuestLogin = async () => {
    try {
        const response = await apiClient.post('api/guest/create/');
        const data = response.data;
        console.log(data)
        if (data) {
            localStorage.setItem('authTokens', JSON.stringify(data.tokens));
            setAuthTokens(data.tokens);
            const user = jwtDecode(data.tokens.access);
            setUser(user);
            navigate('/');  // Redirect to the homepage or dashboard
        } else {
            console.error('Guest login failed');
            alert('Failed to continue as guest.');
        }
    } catch (error) {
        console.error('Error during guest login:', error);
        alert('Guest login error!');
    }
};

  return (
    <div className="bg-deafult flex flex-col md:flex-row gap-4 md:h-screen items-center justify-center gap-x-4">
        <div className='p-8'>
            <h1 className='text-4xl md:text-6xl font-bold text-primary'>Discourse</h1>
            <h1 className='text-2xl md:text-4xl font-semibold'>Hangout Anywhere, Anytime</h1>
            {user ? (
              <NavLink to='/'>
              <Button className='mt-4'>Continue</Button>
            </NavLink>
            ) : (
              <div>
                <NavLink to='/signin'>
                  <Button className='mt-4'>Login</Button>
                </NavLink>
                <Button variant='secondary' className='mt-4 ml-4' onClick={handleGuestLogin}>Try as guest</Button>
              </div>
            )}
        </div>
        <img src="/chatScreenshot1.png" className='w-auto h-[700px] md:h-[500px]'/>
        <img src="/chatScreenshot2.png" className='w-auto h-[700px] md:h-[500px]'/>
    </div>
  )
}

export default Home