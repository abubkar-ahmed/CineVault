import { createContext, useState } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user , setUser] = useState({});
  const [mainLoading , setMainLoading] = useState(true);

  const login = async (email , pwd) => {
    try{
        const response = await axios.post('/login',{email , pwd});
        setUser(response.data)
        setIsLoggedIn(true);
        return {status : true} ;
    }catch (err){
        return {
            status : false ,
            message : err?.response?.data?.message ? err?.response?.data?.message : 'Somthing Went Wrong'
        } ;
    }
    
  };

  const logout = async () => {
    try{
      const response = await axios.get('/logout');
      setUser({});
      setIsLoggedIn(false);
      return true ;
    } catch (err) {
      console.log(err);
      return false
    }
  };


  const refreshToken = () => {
    const refresh = async () => {
      try{
        const response = await axios.get('/refresh');
        setUser(response.data);
        setIsLoggedIn(true);
        setMainLoading(false);
      }catch(err) {
        console.log(err)
        setMainLoading(false)
      }
    }
    return refresh;
};

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout , refreshToken , mainLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;