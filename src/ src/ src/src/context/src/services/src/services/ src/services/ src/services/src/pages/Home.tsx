import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Featured from '../components/Featured'
import Footer from '../components/Footer'

export default function Home() {
  const { user } = useContext(AuthContext)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <Hero />
      <Featured />
      <Footer />
    </div>
  )
}
