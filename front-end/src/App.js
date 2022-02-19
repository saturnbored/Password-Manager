import './App.css';

import Home from './pages/Home';


import LoginForm from './pages/LoginForm';
import Signup from './pages/Signup';
import {BrowserRouter as Router, Routes , Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
          <Route exact path ='/' element={<LoginForm />} />
          <Route exact path ='/register' element={<Signup />} />
      </Routes>
      </div>
    </Router>

  );
}

export default App;
