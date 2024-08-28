import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';
import Chat from './_root/pages/Chat';
import Home from './_root/pages/Home';
import SigninForm from './_auth/SigninForm';

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route element={<RootLayout/>}>
          <Route index element={<Chat />} />
        </Route>
        <Route path='/home' element={<Home />}/>
        <Route path='/signin' element={<SigninForm />}/>
      </Routes>
    </ThemeProvider>
  )
}

export default App
