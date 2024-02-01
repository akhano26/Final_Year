import React, { useState,useEffect } from 'react'
import Head from './Component/Head/Head'
import "./App.css"
import { ToastContainer, toast } from 'react-toastify';
import { loadFull } from "tsparticles";
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import Main_home_page from './Component/Main_home_page/Main_home_page';
import Footer_up from './Component/Footer_up/Footer_up';
import Swap from './Component/Swap/Swap';
import {CrowdFundingProvider} from './Context/Crowdfunding'
import Index from './Index.jsx';




 function App() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);


  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  useEffect(() => {
    if (!isOnline) {
      toast.warn("Check your Internet Connection.")
      console.log('Offline: Please check your internet connection');
    }
  }, [isOnline]);



  return (
    <div className='' >
      {isOnline?(
 <div className='back'>
        
 <CrowdFundingProvider>
 
   <ToastContainer />
   <Head />
   <Routes>
     
     <Route path='/' element={<Main_home_page />} />
     <Route path='/Swap' element={<Swap />} />
     <Route path='/Index' element={<Index/>}/>

   </Routes>
   <Footer_up />
  
   </CrowdFundingProvider>
  
 </div>
      ):
      (
        <div>
          <h1>Check Your Connection</h1>
          <p>Please check your internet connection and try again.</p>
        </div>
      )
      }
     
    </div>
  )
}

export default App
