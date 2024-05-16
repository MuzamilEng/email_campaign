import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

const Main = () => {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState(null);
    useEffect(() => {
      setTimeout(() => {
       const storedType = (localStorage.getItem("token"));
       setLoginType(storedType);
       if(!storedType){
         navigate('/login');
	   } else {
		 navigate('/dashboard');
	   }
       }, 1000);
     }, []);
  
  return (
    <div>
        <Loading />
    </div>
  )
}


export default Main;
