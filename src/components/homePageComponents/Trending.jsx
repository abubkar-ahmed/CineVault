import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "swiper/css/pagination";
import { Pagination } from "swiper";
import MoviesSvg from '../svg/MoviesSvg';
import TvSvg from '../svg/TvSvg';
import { useNavigate } from 'react-router-dom';
import homePageIcon from '../../assets/icons8-external-link-25.png';


function Trending({trending , setTrending}) {
  const navigate = useNavigate();

  return (
    <>
    <Swiper
      slidesPerView={1.5}
      spaceBetween={10}
      grabCursor={true}
      loop={true}
      pagination={false}
      breakpoints={{
          668: {
            slidesPerView: 2.25,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4.5,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 5.5,
            spaceBetween: 20,
          },

      }}
      modules={[Pagination]}
      className="mySwiper"
    >
      {trending.map(e => {
          let date
          if(e?.release_date?.split('-')[0]){
              date = e?.release_date?.split('-')[0]
          }else{
              date = e?.first_air_date?.split('-')[0]
          }
          return (
              <SwiperSlide key={e.id}>
                  <div className="trend-card" >
                      <img src={e.poster_path} alt="" loading="lazy" className='poster-img'/>
                      <div className="info">
                          <span className="realse">
                              {date}
                          </span>
                          <span className='meida-type'>
                              {e.media_type === 'tv' ? (
                                  <>                                  <TvSvg/>
                                  Series
                                  </>
                              ) : (
                                  <>
                                  <MoviesSvg/>
                                  Movie
                                  </>
                              )}
                          </span>
                          <span>{e?.original_language}</span>
                          <img src={homePageIcon} alt="homePageIcon" className='go-to-details' onClick={() => navigate(`details/${e.media_type}/${e.id}`)}/>
                      </div>
                  </div>
              </SwiperSlide>
          )
      })}
    </Swiper>
    </>
  );
}

export default Trending