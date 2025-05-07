import { Route, Routes,} from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import LiveFaceVerifier from './components/LiveFaceVerifier';
import Verify from './components/Verify';


function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/live' element={<LiveFaceVerifier/>} />
          <Route path='/verify' element={<Verify/>} />



      </Routes>
    </>
  );
}

export default App;
