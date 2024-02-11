import { useState } from 'react'
import axios from 'axios'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography';
import React from 'react'
import './index.css'
import { Link } from 'react-router-dom';
import UserImg from '../../../assets/images/USer.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = ({AccountName}) => {

    // Dynamic states for input fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [showToast, setShowToast] = useState(false);

    const showToast = (message, type) => {
        toast[type](message, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });
    };

    // handling login request
    const handleLogin = async (event)=>{
        event.preventDefault();
                // Check if any field is empty
                if (!email || !password) {
                    showToast('Please fill all the fields', 'error');
                    return;
                }
        
        try {
            // sending login requet to backend on endpoint /login using axios
            const response = await axios.post('http://localhost:3001/login', {
                email: email,
                password: password,
              })

              if (response.status === 200) {
                // notification for successful login
                // redirect to dashboard page 
                showToast('Login Successful!', 'success');
            }
            else if(response.status === 500) {
                // notification for unsuccessful signup
                // redirect to login page again with error message 
                showToast('Error Login!', 'error');
                }

        } catch (error) {
            // console.log(error)
            showToast('Email or Password incoorect !', 'error');

        }
    }

  return (
    <Box className="LoginContainer">
        <Box className="LoginBox">
            <Box className="LoginUserImg">
                <img src={UserImg} alt="User" className='LoginImg'/>
                <Typography variant='h6' className='LoginUserImgName' gutterbottom>
                    {`${AccountName} Account`}
                </Typography>
            </Box>
            <Box className="LoginUserData">
                <Typography gutterBottom variant='h5'>Login</Typography>
                    <input 
                        type="text" 
                        placeholder="Enter you email" 
                        className="text-field" 
                        name="email"
                        value={email}
                        onChange={(event)=>{setEmail(event.target.value)}}
                        />
                    <input
                        id='password'
                        type="password"
                        placeholder="Password"
                        className="text-field"
                        name='password'
                        value={password}
                        onChange={(event)=>{setPassword(event.target.value)}}
                    />
                    <button 
                        className="login-button"
                        type='button'
                        onClick={handleLogin}
                    >Login
                    </button>
                    <Link href="#" className="forgot-password">
                        Forgot Password?
                    </Link>
                    <Link to={AccountName === 'Client' ? '/SignupClient' : '/SignupNotary'} className="forgot-password">
                        Don't have an account? Signup
                    </Link>                  
            </Box>
        </Box>
        <ToastContainer />
    </Box>
  )
}

export default Login