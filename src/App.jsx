import React from 'react'
import Register from './Components/Register'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import Profile from './Components/Profile'
import Settings from './Components/Settings'
import { Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast'

export default function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path='/Settings' element={<Settings />} />

      </Routes>
      <Toaster/>
    </>
  )
}
