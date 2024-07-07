import React from 'react'
import { Outlet } from "react-router-dom";

const RootLayout = () => {

    return (
      <div className={`h-screen flex flex-1 p-4`}>
          <Outlet />
      </div>
    )
  }
  
  export default RootLayout