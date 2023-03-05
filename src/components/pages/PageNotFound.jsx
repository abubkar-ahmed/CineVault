import React from 'react'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {
    const navigate = useNavigate();
  return (
    <section className='not-found-404'>
        <h2>Page Not Found 404</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
    </section>
  )
}

export default PageNotFound