import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios';
import dateIcon from '../../assets/icons8-calendar-24.png';
import starIcon from '../../assets/icons8-star-24.png';
import timeIcon from '../../assets/icons8-timer-24.png';
import userImage from '../../assets/user.png';
import homePageIcon from '../../assets/icons8-external-link-25.png';
import episodesIcon from '../../assets/icons8-movie-projector-24.png';
import BookMarksSvg from '../svg/BookMarksSvg';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../Loading';

function MoreDetails() {
    const {type , id} = useParams();
    const [movie , setMovie] = useState({});
    const [tvSeries , setTvSeries] = useState({});
    const [bookMarksList , setBookMarksList] = useState([]);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(type && id){
            getMoreDetails();
        }
    },[type , id]);

    useEffect(() => {
        if(user.accessToken){
            getBookMarksIds();
        }
    },[user])

    const getMoreDetails = async () => {
        try{
            const response = await axios.get(`/details/${type}/${id}`);
            if(type === 'movie'){
                setMovie(response.data);
            }else{
                setTvSeries(response.data);
            }
        }catch (err){
            console.log(err);
            navigate('/404')
        }
    }

    const getBookMarksIds = async () => {
        const axiosPrivate = axios.create({
            headers : {
                'Authorization' : `Bearer ${user?.accessToken}`
            },
            withCredentials: true
        });

        try{
            const response = await axiosPrivate.get(`/bookMarks/ids`);
            setBookMarksList(response.data.media)
        }catch(err){
            console.log(err);
        }
    }

  return (
    <section className='details'>
        {
        type === 'movie' ? (
            movie.name && (
            <Movie 
            movie={movie} 
            bookMarksList={bookMarksList}
            setBookMarksList={setBookMarksList}
            />)
        ) : (
            tvSeries.name && (
            <TvSeries 
            tvSeries={tvSeries}
            bookMarksList={bookMarksList}
            setBookMarksList={setBookMarksList}
            />)
        )
        }
    </section>
  )
}

export default MoreDetails

function Movie({movie , bookMarksList , setBookMarksList}){
    const {user} = useContext(AuthContext);
    const [inBookMarks , setInBookMarks] = useState(false);
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();

    
    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${user?.accessToken}`
        },
        withCredentials: true
    });

    const handleBookMarks = async () => {
        if(!user.accessToken){
            navigate('/login')
        }
        if(!loading){
            setLoading(true)
            try{
                const res = await axiosPrivate.post('/bookMarks' , {bookMarkId : movie.id , mediaType : 'movie'})
                setBookMarksList(res.data.media);
                setLoading(false)
            }catch(err){
                console.log(err);
                setLoading(false)
            }
        }
    }

    const handleRemoveFromBookMarks = async () => {
        if(!loading){
            setLoading(true)
            try{
                const res = await axiosPrivate.delete(`/bookMarks/${movie.id}`);
                setBookMarksList(res.data.media);
                setLoading(false)
            }catch(err){
                console.log(err);
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if(bookMarksList?.length > 0){
            const filtterdList = bookMarksList.filter((e) => {
                return e.mediaId == movie.id ;
            })
            if(filtterdList.length > 0){
                setInBookMarks(true);
            }else{
                setInBookMarks(false);
            }

        }
    },[bookMarksList])

    return (
        <div className='details-container'>
            <div className='backGround-img' style={{ backgroundImage: `url(${movie.back_drop})` }}></div>
            <div className='content-wrapper'>
                {inBookMarks ? (
                    <div className="add-to-bookmarks active" onClick={handleRemoveFromBookMarks}>
                        {loading ? (<Loading/>) : (<BookMarksSvg/>)}
                    </div>
                ) : (
                    <div className="add-to-bookmarks" onClick={handleBookMarks}>
                        {loading ? (<Loading/>) : (<BookMarksSvg/>)}
                    </div>
                )}
                <h2>
                    {movie.name}
                    <a href={movie.homePage} target='_blank'>
                        <img src={homePageIcon} alt="icon" />
                    </a>
                </h2>
                <ul className="first-details">
                    <li>
                        <img src={dateIcon} alt="icon" />
                        {movie.date}
                    </li>
                    <li>
                        <img src={timeIcon} alt="icon" />
                        {movie.runTime}
                    </li>
                    <li>
                        <img src={starIcon} alt="icon" />
                        {movie.vote}
                    </li>
                </ul>
                <div className="genres">
                    <span>Genres:</span> 
                    {movie.genres}
                </div>
                <div className="overview">
                    {movie.overview}
                </div>
                <ul className="cast">
                    <h3>Cast </h3>
                    {movie?.cast?.map(e => {
                        return (
                            <li key={e.id}>
                                <img src={e.image ? e.image : userImage} alt="image" />
                                <h4>{e.name}</h4>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
function TvSeries({tvSeries , bookMarksList , setBookMarksList}){
    const [displaySeason , setDisplaySeason] = useState(1);
    const [seasongInfo , setSeasonInfo] = useState({});
    const [seasonsCount , setSeasonCount] = useState('');
    const [inBookMarks , setInBookMarks] = useState(false);
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if(tvSeries?.seasons?.length > 0){
            setSeasonInfo(...tvSeries?.seasons?.filter(e => {
                return e.season_number === displaySeason
            }));

            const filterdSeasons = tvSeries?.seasons?.filter(e => {
                return e.season_number !== 0;
            })
            setSeasonCount(filterdSeasons?.length);
        }
    },[displaySeason , tvSeries]);

    const {user} = useContext(AuthContext);

    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${user?.accessToken}`
        },
        withCredentials: true
    });

    const handleAddToBookMarks = async () => {
        if(!user.accessToken){
            navigate('/login')
        }
        if(!loading){
            setLoading(true)
            try{
                const res = await axiosPrivate.post('/bookMarks' , {bookMarkId : tvSeries.id , mediaType : 'tv'})
                setBookMarksList(res.data.media);
                setLoading(false)
            }catch(err){
                console.log(err);
                setLoading(false)
            }
        }
    }

    const handleRemoveFromBookMarks = async () => {
        if(!loading){
            setLoading(true)
            try{
                const res = await axiosPrivate.delete(`/bookMarks/${tvSeries.id}`);
                setBookMarksList(res.data.media);
                setLoading(false)
            }catch(err){
                console.log(err);
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if(bookMarksList?.length > 0){
            const filtterdList = bookMarksList.filter((e) => {
                return e.mediaId == tvSeries.id ;
            })
            if(filtterdList.length > 0){
                setInBookMarks(true);
            }else{
                setInBookMarks(false);
            }

        }
    },[bookMarksList])
    
    return (
        <div className='details-container'>
            <div className='backGround-img' style={{ backgroundImage: `url(${tvSeries.back_drop})` }}></div>
            <div className='content-wrapper'>
                {inBookMarks ? (
                    <div className="add-to-bookmarks active" onClick={handleRemoveFromBookMarks}>
                        {loading ? (<Loading/>) : (<BookMarksSvg/>)}
                    </div>
                ) : (
                    <div className="add-to-bookmarks" onClick={handleAddToBookMarks}>
                        {loading ? (<Loading/>) : (<BookMarksSvg/>)}
                    </div>
                )}
                <h2>
                    {tvSeries.name}
                    <a href={tvSeries.homePage} target='_blank'>
                        <img src={homePageIcon} alt="icon" />
                    </a>
                </h2>
                <ul className="first-details">
                    <li>
                        <img src={dateIcon} alt="icon" />
                        {tvSeries.date}
                    </li>
                    <li>
                        {seasonsCount} Season{seasonsCount > 1 && 's'}
                    </li>
                    <li>
                        <img src={starIcon} alt="icon" />
                        {tvSeries.vote}
                    </li>
                </ul>
                <div className="genres">
                    <span>Genres:</span> 
                    {tvSeries.genres}
                </div>
                <div className="overview">
                    {tvSeries.overview}
                </div>
                <ul className='seasons-controls'>
                    {tvSeries?.seasons?.map(e => {
                        if(e.season_number > 0){
                            return (
                                <li key={e.id} onClick={() => {setDisplaySeason(e.season_number)}} className={e.season_number === displaySeason ? 'active' : ''}>
                                    Season {e.season_number}
                                </li>
                            )
                        }
                    })}
                </ul>
                
                <ul className="season-info">
                    <li>
                        <img src={dateIcon} alt="icon" />
                        {seasongInfo?.air_date ? seasongInfo?.air_date : 'Unknown'}
                    </li>
                    <li>
                        <img src={episodesIcon} alt="icon" />
                        {seasongInfo?.episode_count} episodes
                    </li>
                </ul>

                <ul className="cast">
                    <h3>Cast </h3>
                    {tvSeries?.cast?.map(e => {
                        return (
                            <li key={e.id}>
                                <img src={e.image ? e.image : userImage} alt="image" />
                                <h4>{e.name}</h4>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}