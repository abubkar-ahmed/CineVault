import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../svg/Logo';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../Loading';

function Login() {
  const { login } = useContext(AuthContext);
  const [email , setEmail] = useState('');
  const [pwd , setPwd] = useState('');
  const [errMsg , setErrMsg] = useState('');
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();

  const formValidation = () => {
    if(!email || !pwd){
      setErrMsg("All Fields Are requred!");
      return false
    }
    return true ;
  }

  const loginHandler = async (e) => {
    e.preventDefault();
    const validate = formValidation();
    if(validate){
      setLoading(true);
      const loginStatus = await login(email , pwd);
      if(loginStatus.status){
        setLoading(false);
        navigate('/')
      }else{
        setLoading(false);
        setErrMsg(loginStatus.message)
      }
    }
  }


  return (
    <div className="auth-container" >
      <Link to='/' title='Home'><Logo/></Link>
      <form onSubmit={loginHandler}>
        <h2>Login</h2>
        <input type="email" name='email' placeholder='Email Address' onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" name='pwd' placeholder='Password' onChange={(e) => setPwd(e.target.value)}/>
        <div className="submit-container">
          {loading ? (<Loading/>) : (
            <button>Login to your account</button>
          )}
        </div>
        <p>Don’t have an account? <Link to='/register'>Register</Link></p>
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

export default Login