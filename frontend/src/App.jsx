import { Route, Routes,} from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import LiveFaceVerifier from './components/LiveFaceVerifier';
import Verify from './components/Verify';
import RegisterForm from './components/InstitutionRegister';
import Institution from './components/Institution';


function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/' element={<Home/>} />

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
