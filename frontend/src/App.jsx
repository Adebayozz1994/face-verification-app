import { Route, Routes,} from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import LiveFaceVerifier from './components/LiveFaceVerifier';
import Verify from './components/Verify';
import RegisterForm from './components/InstitutionRegister';
import Institution from './components/Institution';
import Login from './components/Login';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/live' element={<LiveFaceVerifier/>} />
          <Route path='/verify' element={<Verify/>} />
          <Route path="/register/:linkId" element={<RegisterForm />} />
          <Route path='/institution' element={<Institution/>} />
      </Routes>
    </>
  );
}

export default App;
