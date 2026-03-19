import { useState } from 'react'
import Head from 'next/head'
export default function CompanyPage() {
  const [page, setPage] = useState('about')
  return (
    <>
      <Head><title>Nextoken Capital</title></Head>
      <div style={{background:'#060810',color:'#e8edf5',minHeight:'100vh',padding:'80px 40px',fontFamily:'sans-serif'}}>
        <h1 style={{color:'#38bd82'}}>Company Pages Coming Soon</h1>
        <p>About | Careers | Press | Blog | API Docs</p>
      </div>
    </>
  )
}
