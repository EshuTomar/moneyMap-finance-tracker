import React, { useState } from 'react'
import "./styles.css";
import Input from '../input';
import Button from '../Button';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup  } from "firebase/auth";
import { auth, db, provider } from '../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth/web-extension';

const SignupSigninComponent =()=> {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const[loginForm, setLoginForm] = useState(false);
    const navigate = useNavigate();


    // const auth = getAuth();

    function signupWithEmail(){
        console.log("Name", name);
        console.log("email", email);
        console.log("password", password);
        console.log("confirmPassword",confirmPassword);
        // authenticate the user or basically create a new accountusing email and password

        if(name != ""&& email != "" && password != "" && confirmPassword != ""){
            if(password == confirmPassword){
                setLoading(true);

                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    toast.success("User Created")
                    setLoading(false);
                    setName("")
                    setEmail("")
                    setPassword("")
                    setConfirmPassword("")
                    // ...
                    createDoc(user);
                    navigate('/dashboard');
                    // create a doc with user id as the following id
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                    // ..
                });
            }else{
                toast.error("Password and Confirm Password doesn't match!");
                setLoading(false);
            }
           
        }else{
            toast.error("All fields are mandatory!");
            setLoading(false);
        }

   } 

   

   function loginUsingEmail(){

    setLoading(true);
    if(email != "" && password != "" ){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            toast.success("User Logged in!");
            setLoading(false);
            navigate("/dashboard");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }else{
        toast.error("All fields are mandatory!")
    }
   
    }

    
   async function createDoc(user){
    // make sure that doc with uid doesn't exist
    // create a doc
    setLoading(true);
    if(!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if(!userData.exists()){
        
        try{
            await setDoc(doc(db, "users", user.uid), { 
                name: user.displayName ? user.displayName : name,
                email : user.email,
                photoUrl: user.photoUrl ? user.photoUrl : "",
                createdAt: new Date(),
            });
            toast.success("Doc created")
            setLoading(false);
        }catch(err){
            toast.error(err.message)
            setLoading(false);
        }
    }else{
        // toast.error("Doc already exist");
        setLoading(false);
    }
    
   }

   function googleAuth(){
    setLoading(true);
    try{
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            toast.success("User authenticated");
            navigate('/dashboard')
            createDoc(user);
            setLoading(false);
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
            setLoading(false);
           
            // ...
        });
    }catch(err){
        toast.error(err.message);
        setLoading(false);
    }

    
   }


  return (
    <>
    {loginForm ? (
        <> 
        <div className='signup-wrapper'>

        <h2 className='title'>
            Sign in on 
            <span style={{color: "var(--theme)"}}> MoneyMap </span>
        </h2>
        <form>
            
            <Input 
                type="email"
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"johndoe@gmail.com"}
            />
            <Input
                label={"Password"}
                type="password"
                state={password}
                setState={setPassword}
                placeholder={"Example123"}
            />
        <Button 
                disabled={loading}
                text={loading? "Loading..." : "Login Using Email and Password"} 
                onClick={loginUsingEmail}
            />
            <p style={{textAlign:"center", margin:0 }}>or</p>
            <Button 
                onClick={googleAuth}
                text={loading? "Loading..." : "Login Using Google"} 
                blue={true}
            />
            <p style={{textAlign:"center", margin:0, fontSize:"0.8rem", cursor:'pointer'}} 
                onClick={()=>setLoginForm(!loginForm)}>
                    or Don't Have An Account? Click here 
            </p>
        </form>

        </div>
        </>
    ) : (
        <div className='signup-wrapper'>

            <h2 className='title'>
                Sign up on 
                <span style={{color: "var(--theme)"}}> MoneyMap </span>
            </h2>
            <form>
                <Input 
                    type="text"
                    label={"Full Name"}
                    state={name}
                    setState={setName}
                    placeholder={"John Doe"}
                />
                <Input 
                    type="email"
                    label={"Email"}
                    state={email}
                    setState={setEmail}
                    placeholder={"johndoe@gmail.com"}
                />
                <Input
                    label={"Password"}
                    type="password"
                    state={password}
                    setState={setPassword}
                    placeholder={"Example123"}
                />
                <Input 
                    type="password"
                    label={"Confirm Password"}
                    state={confirmPassword}
                    setState={setConfirmPassword}
                    placeholder={"Example123"}
                />

                <Button 
                    disabled={loading}
                    text={loading? "Loading..." : "Signup Using Email and Password"} 
                    onClick={signupWithEmail}
                />
                <p style={{textAlign:"center", margin:0 }}>or</p>
                <Button 
                    onClick={googleAuth}
                    text={loading? "Loading..." : "Signup Using Google"} 
                    blue={true}
                />
                <p style={{textAlign:"center", margin:0, fontSize:"0.8rem", cursor:'pointer'}} 
                onClick={()=>setLoginForm(!loginForm) }>or Have An Account Already? Click here </p>
            </form>

        </div>
    )}
    
    </>
  )
}


export default SignupSigninComponent;
