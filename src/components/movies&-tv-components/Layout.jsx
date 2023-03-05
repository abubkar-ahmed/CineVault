import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from '../../api/axios';
import Loading from '../Loading';
import MoviesSvg from '../svg/MoviesSvg';
import TvSvg from '../svg/TvSvg';
import { useNavigate } from 'react-router-dom';

function Layout({page}) {
  const [paginationCount , setPaginationCount] = useState(1);
  const [displaying , setDisplaying] = useState([]);
  const [loading , setLoading] = useState(false);
  const [mediaType , setMediaType] = useState('');
  const observer = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if(page === 'movies'){
      setDisplaying([])
      setPaginationCount(1)
      getMovies();
      setMediaType('movie')
    }
    if(page === 'tv series'){
      console.log(page)
      setDisplaying([])
      setPaginationCount(1)
      getTv();
      setMediaType('tv')
    }
  }, [page]);



  const getMovies = async () => {
    try{
      const response = await axios.get(`/data/movies/${paginationCount}`);
      const newDissplaying = [...displaying , ...response.data.result]
      setDisplaying(newDissplaying.filter((item, index) => {
        return newDissplaying.indexOf(item) === index
      }))
      setPaginationCount(prev => prev + 1);
      setLoading(false)
    }catch (err) {
      console.log(err);
    }
  }

  const getTv = async () => {
    try{
      const response = await axios.get(`/data/tv/${paginationCount}`);
      const newDissplaying = [...displaying , ...response.data.result]
      setDisplaying(newDissplaying.filter((item, index) => {
        return newDissplaying.indexOf(item) === index
      })
      )
      setPaginationCount(prev => prev + 1);
      setLoading(false)
    }catch (err) {
      console.log(err);
    }
  }


  const loadMore = useCallback(() => {
    if (paginationCount > 100) {
      console.log('done');
      return;
    }
    setLoading(true);
    if(page === 'movies'){
      getMovies();
    }
    if(page === 'tv series'){
      getTv();
    }
  }, [displaying , loading]);

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 1 }
      );
      if (node) observer.current.observe(node);
    },
    [loadMore]
  );

  
  return (
    <>
    <h1 className='main-header'>{page}</h1>
    {displaying.length > 0 && (
      <ul className="recomended-list">
          {displaying.map(e => {
            let lastElemnt = false;
            if(displaying.indexOf(e) === displaying.length - 1){
              lastElemnt = true
            }
              return (
                <li className="recommended-card" key={e.id} onClick={() => navigate(`/details/${mediaType}/${e.id}`)}>
                  <div className="postr-container">
                    <img src={e.poster_path} alt={e.original_name} loading='lazy'/>
                  </div>
                  <div className="info">
                    <span>{e.date}</span>
                    {mediaType === 'tv' ? (
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
                    <span>{e.original_language}</span>
                  </div>
                  <h3>
                    {e.original_name}
                  </h3>
                  {lastElemnt && (
                    <div ref={lastElementRef}></div>
                  )}
                  
                </li>
              )
          })}

      </ul>
    )}
    {loading && (
    <div className='loading-container-recommended'>
      <Loading/>
    </div>
    )}
    </>
  )
}

export default Layout