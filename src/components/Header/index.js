import React, { useEffect } from 'react'
import "./style.css";
import { auth } from '../../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userImg from "../../assets/user.svg"
function Header() {
   
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(()=>{
    if(user){
      navigate('/dashboard')
    }
  },[user, loading])

  function logoutFunc(){
    try{
      signOut(auth).then(()=>{
        //Sign-out successfully
        toast.success("Logged-out successfully")
        navigate('/')
      }).catch((error)=>{
        // An error happened
        toast.error(error.message);
      })
    }catch(e){
      toast.error(e.message);
    }
  }

  return (
    <div className='navbar'>
      <p className='logo' style={{}}>MoneyMap</p>
      {user && (
        <div style={{display: "flex",
          alignItems:"center",
          gap:"0.7rem"
        }}>
          <img src={user.photoURL? user.photoURL:userImg} style={{height:"1.5rem", width:"1.5rem", borderRadius:"50%" }}/>
          <p className='logo link' onClick={logoutFunc}>Logout</p>
        </div>
      )}
    </div>
  )
}

export default Header;
