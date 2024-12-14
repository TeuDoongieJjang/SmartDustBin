import Home from './pages/Home.jsx'
import AddDate from './pages/AddDate.jsx'
import HomeEdit from './pages/HomeEdit.jsx'
import DateEdit from './pages/DateEdit.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'

axios.defaults.baseURL = 'https://smart-bin-d25n.onrender.com/api';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={ <Navigate to='/api' />} />
        <Route path='/api' element={<Home />} />
        <Route path='/api/add/:bin' element={ <AddDate /> } />
        <Route path='/api/:del' element={ <HomeEdit /> } />
        <Route path='/api/:field/:date' element={ <DateEdit /> } />
      </Routes>
    </>
  )
}

export default App