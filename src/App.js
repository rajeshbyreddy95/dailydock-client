import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MakeMySchedule from './pages/MakeMySchedule';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="App">
       <BrowserRouter>
            <Routes>
                <Route path='/' Component={Home}></Route>
                <Route path='/login' Component={Login}></Route>
                <Route path='/signup' Component={Signup}></Route>
                <Route path='/my-schedule' Component={Schedule}></Route>
                <Route path='/make-my-schedule' Component={MakeMySchedule}></Route>
                <Route path='/profile' Component={Profile}></Route>
                
            </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
