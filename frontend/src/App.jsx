import React from 'react'
import HomePage from './pages/HomePage'
import signUpPage from './pages/signuppage'
import LoginPage from './pages/loginpage'
import home from './pages/HomePage'
import home from './pages/HomePage'
import { Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Navbar/>

      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<signUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>

      </Routes>
    </div>
  )
}

export default App