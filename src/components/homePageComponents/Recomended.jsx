import React, { useEffect, useRef, useState , useCallback} from 'react'
import Loading from '../Loading';
import MoviesSvg from '../svg/MoviesSvg';
import TvSvg from '../svg/TvSvg';
import { useNavigate } from 'react-router-dom';

function Recomended({list}) {

  const [displaingReco , setDispalyingReco] = useState([]);
  const observer = useRef(null);
  const [loading , setLoading] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    if(list.length > 0){
      setDispalyingReco(list?.slice(0 , 8));
    }
  },[list])

  const loadMore = useCallback(() => {
    if (displaingReco.length >= list.length) {
      console.log('done');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const slicedReco = list.slice(
        0,
        displaingReco.length + 8 > list.length ? list.length : displaingReco.length + 8
      );
      setLoading(false)
      setDispalyingReco(slicedReco);
    }, 500);

    
  }, [displaingReco, list , loading]);


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
    {displaingReco.length > 0 && (
      <ul className="recomended-list">
          {displaingReco.map(e => {
            let lastElemnt = false;
            if(displaingReco.indexOf(e) === displaingReco.length - 1){
              lastElemnt = true
            }
              return (
                <li className="recommended-card" key={e.id} onClick={() => navigate(`details/${e.mediaType}/${e.id}`)}>
                  <div className="postr-container">
                    <img src={e.poster} alt={e.title} loading='lazy'/>
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

export default Recomended

