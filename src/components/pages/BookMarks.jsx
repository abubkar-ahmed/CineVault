import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../Loading';
import MoviesSvg from '../svg/MoviesSvg';
import TvSvg from '../svg/TvSvg';

function BookMarks() {
    const {user} = useContext(AuthContext);
    const [list , setList] = useState([]);
    const navigate = useNavigate();
    const [loading , setLoading] = useState(true);

    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${user?.accessToken}`
        },
        withCredentials: true
    });

    useEffect(() => {
        if(user.accessToken){
            getBookMarksDetails();
        }
    },[user])

    const getBookMarksDetails = async () => {
        try{
            const res = await axiosPrivate.get('/bookMarks/details');
            setList(res.data)
            setLoading(false);
        }catch(err){
            console.log(err);
            setLoading(false)
        }
    }


  return (
    <section className='bookMarks'>
        {list.length > 0 ? (
            <>
            <h1 className='main-header'>Bookmarked</h1>
            {list.length > 0 && (
                <ul className="recomended-list">
                {list.map(e => {
                    return (
                        <li className="recommended-card" key={e.id} onClick={() => navigate(`/details/${e.mediaType}/${e.id}`)}>
                        <div className="postr-container">
                            <img src={e.poster} alt={e.tilte} loading='lazy'/>
                        </div>
                        <div className="info">
                            <span>{e.date}</span>
                            {e.mediaType === 'tv' ? (
                            <span>
                                <TvSvg/>
                                Tv Seiers
                            </span>
                            ) : (
                            <span>
                                <MoviesSvg/>
                                Movie
                            </span>
                            )}
                            <span>{e.lan}</span>
                        </div>
                        <h3>
                            {e.title}
                        </h3>
                        </li>
                    )
                })}

            </ul>
            )}
            </>
        ) : loading ? (
            <div className="loadingContainer">
                <Loading/>
            </div>
        ) : (
            <h4>You have no bookmark, nothing to show</h4>
        )
        
        }
    </section>
  )
}

export default BookMarks