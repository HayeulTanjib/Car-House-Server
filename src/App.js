import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Pages/Home/Home';
import Header from './Components/Shared/Header/Header';
import Footer from './Components/Shared/Footer/Footer';

function App() {
  return (
    <div className="App">
     <Header/>
     <Routes>
       <Route path='/' element={<Home/>}></Route>
     </Routes>
     <Footer/>
    </div>
  );
}

export default App;
