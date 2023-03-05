import React, { useContext, useEffect, useState } from 'react'
import axios from '../../api/axios'
import { AuthContext } from '../../context/AuthContext';
import Recomended from '../homePageComponents/Recomended';
import Trending from '../homePageComponents/Trending';

function HomePage() {
    const [trending , setTrending] = useState([]);
    const [recommended , setRecommended] = useState([]);
    const {user , isLoggedIn} = useContext(AuthContext);
    const [recommendedOnUser , setRecommendedOnUser] = useState()

    useEffect(() => {
        getTrending();
    },[]);

    useEffect(() => {
        if(isLoggedIn){
            getRecomended()
        }
    },[isLoggedIn])

    const getTrending = async () => {
        try{
            const trendRes = await axios.get('/data');
            setTrending(trendRes?.data?.trending);
            setRecommended(trendRes?.data?.papular);            
        }catch (err){
            console.log(err)
        }
    }

    const getRecomended = async () => {
        const axiosPrivate = axios.create({
            headers : {
                'Authorization' : `Bearer ${user?.accessToken}`
            },
            withCredentials: true
        });

        try{
            const res = await axiosPrivate.get('/data/recomended');
            const uniqueData = Array.from(new Set(res.data.map(JSON.stringify))).map(JSON.parse);
            setRecommendedOnUser(uniqueData);
        }catch(err){
            console.log(err);
        }
    }


  return (
    <div className="home-page">
        <section className='trending'>
            <h2 className='main-header'>Trending</h2>
            <Trending trending={trending} />
        </section>
        <section className='recommended'>
            <h2 className='main-header'>Recommended for you</h2>
            <Recomended list={isLoggedIn && recommendedOnUser?.length > 0 ? recommendedOnUser : recommended}/>
        </section>        
    </div>


    
  )
}

export default HomePage