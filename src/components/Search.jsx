import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import SearchSvg from './svg/SearchSvg'

function Search() {
  const [search , setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submitHandler = (e) => {
    e.preventDefault();

    if(search){
      navigate(`/result/${search}`);
    }
  }

  useEffect(() => {
    if(search){
      setSearch('');
    }
  },[location])


  return (
    <form className='search' onSubmit={submitHandler}>
        <SearchSvg/>
        <input type="text" name='search' placeholder='Search for movies or TV series' onChange={(e) => setSearch(e.target.value)} value={search}/>
    </form>
  )
}

export default Search