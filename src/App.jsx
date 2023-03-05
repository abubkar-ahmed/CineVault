import { useContext, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import HomePage from './components/pages/HomePage'
import Search from './components/Search'
import {Routes , Route, useLocation} from 'react-router-dom'
import Movies from './components/pages/Movies'
import Tv from './components/pages/Tv'
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import { AuthContext } from './context/AuthContext'
import MoreDetails from './components/pages/MoreDetails'
import BookMarks from './components/pages/BookMarks'
import SearchResult from './components/pages/SearchResult'
import TopIcon from './assets/icons8-scroll-up-25.png'
import PageNotFound from './components/pages/PageNotFound'
import ProtectedRoutesAuth from './protectedRoutes/ProtectedRoutesAuth'
import ProtectedRoutesBookMark from './protectedRoutes/ProtectedRoutesBookMark';
import BackGroundImg from './assets/stacked-steps-haikei.svg'
import Loading from './components/Loading'

function App() {
  const [showHeader , setShowHeader] = useState(true);
  const {refreshToken , mainLoading} = useContext(AuthContext);
  const [scrollToTop , setScrollToTop] = useState(false);

  const {pathname} = useLocation();
  const appRef = useRef(null);

  useEffect(() => {
    if(pathname === '/login' || pathname === '/register'){
      setShowHeader(false)
      appRef.current?.classList?.add('auth')
    }else{
      setShowHeader(true);
      appRef.current?.classList?.remove('auth')
    }
  }, [pathname]);

  useEffect(() => {
    const refresh = refreshToken() ;
    refresh();
  }, [])

  const handleScrollToTopBtn = () => {
    appRef.current?.scrollIntoView({behavior: 'smooth'});
  }

  const handleScroll = () => {
    if(window.scrollY > 100){
      setScrollToTop(true);
    }else{
      setScrollToTop(false)
    }
  }

  
  useEffect(() => {
    window.addEventListener('scroll' , handleScroll)

    return () => window.removeEventListener('scroll' , handleScroll)
  })

  const styles = {
    backgroundImage: !showHeader ? `url(${BackGroundImg})` : ``
  }

  
  return (
    <> 
      {mainLoading ? (
        <div className='app-loading'>
          <Loading/>
        </div>
      ) : (
        <div className="app-container" ref={appRef} style={styles}>
          {showHeader && <Header/>}
          <main>
            {showHeader && <Search/>}
            <Routes> 
              <Route path='/' element={<HomePage/>} />
              <Route path='/movies' element={<Movies/>} />
              <Route path='/tv' element={<Tv/>} />
              <Route path='/details/:type/:id' element={<MoreDetails/>} />
              <Route element={<ProtectedRoutesBookMark/>}>
                <Route path='/bookmarks' element={<BookMarks/>} />
              </Route>
              <Route path='/result/:query' element={<SearchResult/>}/>
              <Route element={<ProtectedRoutesAuth/>}>
                <Route path='/register' element={<Register/>} />
                <Route path='/login' element={<Login/>} />
              </Route>

              <Route path='*' element={<PageNotFound/>}/>
            </Routes>
          </main>
          {scrollToTop && (
            <button onClick={handleScrollToTopBtn} className='scroll-top'>
              <img src={TopIcon} alt="Scroll To Top" />
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default App