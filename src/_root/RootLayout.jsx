import React from 'react'
import { Outlet } from "react-router-dom";
import Topbar from '@/components/shared/Topbar';
import Sidebar from '@/components/shared/Sidebar';

const RootLayout = ({userInfo}) => {

    return (
      <div className={`h-screen flex flex-col flex-1 p-4 pt-16`}>
          <Topbar userInfo={userInfo}/>
          <div className='flex h-full'>
          <Outlet />
          </div>
      </div>
    )
  }
  
  export default RootLayout