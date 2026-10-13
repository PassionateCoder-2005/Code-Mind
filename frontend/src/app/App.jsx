import React, { useEffect } from 'react'
import IDELayout from '../components/ide/IDELayout'
import { getCurrentUser } from '../store/authThunk'
import { useDispatch } from 'react-redux'
import { RouterProvider } from 'react-router'
import { router } from './AppRoutes'

const App = () => {
  const dispatch=useDispatch();
  useEffect(()=>{
   dispatch(getCurrentUser());
  },[])
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App