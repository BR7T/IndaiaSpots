import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../src/Fonts/fontFace.sass"

import Login from "./Pages/LoginPage/login";
import HomePage from "./Pages/HomePage/home.jsx"
import Register from  "./Pages/RegisterPage/Register"
import Blabla from "./blablabla"

function App(){
    return(
    <BrowserRouter>
      
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={<HomePage />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/blabla" element={<Blabla />}/>
      </Routes>
    </BrowserRouter>
    )
}

export default App