import React from 'react'
import {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from 'react-router-dom';
import { useTheme } from "@/components/theme-provider"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import apiClient from '../services/apiClient';
import { jwtDecode } from 'jwt-decode';

export function SigninForm() {

  let {loginUser, setUser, setAuthTokens} = useContext(AuthContext)

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginUser(event);
  };

  const handleBackClick = () => {
    navigate('/home')
  }

  const { theme } = useTheme();
  const fontColor = theme === 'dark' ? 'text-muted-foreground' : 'text-primary';

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
    <div className="relative bg-deafult flex flex-col gap-4 h-screen flex items-center justify-center gap-x-4">
        <FontAwesomeIcon onClick={handleBackClick} className='text-primary absolute top-4 left-4' size='xl' icon={faChevronLeft} />
        <div className='flex font-bold text-5xl text-primary'><h1 >Discourse</h1></div>
        <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>to start chatting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <Input maxLength={30} type="text" name="username" placeholder="Enter username"/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Password</Label>
                <Input maxLength={30} type="password" name="password" placeholder="Enter password"/>
              </div>
              <Button className='w-full' type="submit">Sign in</Button>
              <Button onClick={handleGuestLogin} type="button" variant="secondary">Continue as guest</Button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-600">Sign up</Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
  )
}

export default SigninForm