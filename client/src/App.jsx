// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import './App.css'

// function App() {
//   return (

    
//     <BrowserRouter>
    
//       <Routes>
        
//         <Route path="/" element={<h1 className=" text-red-500 font-bold text-5xl ">Welcome to TicketWiz</h1>} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      {/* Toaster handles the popup notifications */}
      <Toaster position="top-center" />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Placeholder for Dashboard (we will build this next) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Redirect empty path to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;