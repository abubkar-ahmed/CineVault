import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../svg/Logo'
import avatar from '../../assets/icons8-account-64.png'
import check from '../../assets/icons8-checkmark-24.png'
import axios from '../../api/axios'
import Loading from '../Loading';

function Register() {

  const emailRef = useRef(null);
  const pwdRef = useRef(null);
  const rPwdRef = useRef(null);
  const [inputs , setInputs] = useState({
    email : '',
    pwd : '',
    rPwd : ''
  });
  const [img , setImg] = useState('');
  const [errMsg , setErrMsg] = useState('');
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false)

  const fileHandle = (e) => {
    setImg(e.target.files[0])
  }

  const inputHandler = (e) => {
    const { name , value } = e.target ;
    setInputs((prevInputs) => {
        return {...prevInputs , [name] : value} ;
    })
  }

  const formValidation = () => {
    if(!inputs.email){
      emailRef.current.classList.add('err-input');
      setErrMsg("All Fields Are requred!");
      return false
    }
    if(!inputs.pwd){
      pwdRef.current.classList.add('err-input');
      setErrMsg("All Fields Are requred!");
      return false
    }
    if(!inputs.rPwd){
      rPwdRef.current.classList.add('err-input');
      setErrMsg("All Fields Are requred!");
      return false
    }

    return true ;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const validate = formValidation();

    if(validate){
      setLoading(true);
      let formData = new FormData();
      formData.append('img' , img);
      formData.append('email' , inputs.email);
      formData.append('pwd' , inputs.pwd);
      formData.append('rPwd' , inputs.rPwd);

      const axios1 = axios.create({
        headers: { 'Content-Type': 'multipart/form-data'},
        withCredentials: true
      });

      try{
        const response = await axios1.post("/register", formData);
        setLoading(false)
        navigate('/login');
      }catch (err) {
        console.log(err)
        setLoading(false)
        if(err?.response?.data?.message){
          setErrMsg(err?.response?.data?.message)
        }else{
          setErrMsg("Somthing Went Wrong Please Try Again Later")
        }
      }
    }
  }

  useEffect(() => {
    if(errMsg){
      setErrMsg('');
      emailRef.current.classList.remove('err-input');
      pwdRef.current.classList.remove('err-input');
      rPwdRef.current.classList.remove('err-input');
    }
  },[inputs]);

  return (
    <div className="auth-container">
      <Link to='/' title='Home'><Logo/></Link>
      <form onSubmit={submitHandler}>
        <h2>Register</h2>
        <input type="email" name='email' placeholder='Email Address' value={inputs.email} onChange={inputHandler} ref={emailRef}/>
        <input type="password" name='pwd' placeholder='Password' value={inputs.pwd} onChange={inputHandler} ref={pwdRef}/>
        <input type="password" name='rPwd' placeholder='Repeat Password' value={inputs.rPwd} onChange={inputHandler} ref={rPwdRef}/>
        <div className="avatar">
          <label htmlFor="img">
              <img src={avatar} alt="avatar" className='avatar-img'/>
              <span>Add User Avatar</span>
              {img && (
              <div className="uploading">
                <img src={check} alt="check" className='check'/>
              </div>
              )}
          </label>
          <input type="file" id='img' name='img' className='avatar-input' onChange={fileHandle}/>
        </div>
        <div className="submit-container">
          {loading ? (<Loading/>) : (
            <button>Create an account</button>
          )}
        </div>
        <p>Alredy have an account? <Link to='/login'>Login</Link></p>
      </form>
      {errMsg && (
        <div className="err animate__animated animate__backInDown">
          {errMsg}
          <span onClick={() => setErrMsg("")}>x</span>
        </div>
      )}
    </div>

  )
}

export default Register