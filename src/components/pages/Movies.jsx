import React, { useEffect } from 'react'
import Layout from '../movies&-tv-components/Layout';

function Movies() {
  const page = 'movies';
  return (
    <section>
      <Layout page={page}/>
    </section>
  )
}

export default Movies