import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import Loading from '../Loading';
import MoviesSvg from '../svg/MoviesSvg';
import TvSvg from '../svg/TvSvg';
import useElemntOnScreen from '../../hooks/useElementOnScreen';


function SearchResult() {
  const { query } = useParams();
  const [pageCount, setPageCount] = useState(1);
  const [displaying, setDisplaying] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(0);
  const [totalResult, setTotalResult] = useState(0);
  const navigate = useNavigate();

  const options = {
    root : null,
    rootMargin:'0px',
    threshold: 0.3
  }

  const lastRef = useRef(null);
  const lastVis = useElemntOnScreen(options,lastRef);

  useEffect(() => {
    if(lastVis){
        if(pageCount < pages){
          loadMore();
        }else{
          return ;
        }
    }
},[lastVis])

  useEffect(() => {
    if (query) {
      setPages(0);
      setTotalResult(0);
      setPageCount(1);
      setDisplaying([]);
      getSearch();
    }
  }, [query]);




  const getSearch = async () => {
    try {      
      setLoading(true);
      const res = await axios.get(`/search/${query}/1`);
      const newResults = res.data.results;
      setDisplaying(newResults);
      setPages(res.data.pages);
      setTotalResult(res.data.total_results);
      setPageCount((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/search/${query}/${pageCount}`);
      const newResults = res.data.results;
      const uniqueResults = newResults.filter(
        (result) => !displaying.some((item) => item.id === result.id)
      );

      setDisplaying(prev => [...prev , ...uniqueResults]);

      setPages(res.data.pages);
      setTotalResult(res.data.total_results);
      setPageCount((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


    return (
        <>
        <h1 className='main-header result-header'>Found {totalResult} results For "{query}"</h1>
        {displaying.length > 0 && (
          <ul className="recomended-list result">
              {displaying.map(e => {
                let lastElemnt = false;
                if(displaying.indexOf(e) === displaying.length - 1){
                  lastElemnt = true
                }
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
                        <span>{e.date}</span>
                      </div>
                      <h3>
                        {e.title}
                      </h3>
                      {lastElemnt && (
                        <div ref={lastRef}></div>
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

export default SearchResult