import { Route, Routes,} from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import LiveFaceVerifier from './components/LiveFaceVerifier';
import Verify from './components/Verify';
import InstitutionRegister from './components/InstitutionRegister';
import RegisterForm from './components/InstitutionRegister';


function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/live' element={<LiveFaceVerifier/>} />
          <Route path='/verify' element={<Verify/>} />
          <Route path="/institution/register" element={<InstitutionRegister />} />
          <Route path="/register/:linkId" element={<RegisterForm />} />
      </Routes>
    </>
  );
}

export default App;
