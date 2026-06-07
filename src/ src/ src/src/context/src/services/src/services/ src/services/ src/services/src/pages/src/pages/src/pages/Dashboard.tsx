import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getAllApps, getUserPurchasedApps } from '../services/appService'
import { getUserProfile } from '../services/userService'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const [apps, setApps] = useState<any[]>([])
  const [purchasedApps, setPurchasedApps] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      try {
        const allApps = await getAllApps()
        const purchased = await getUserPurchasedApps(user.uid)
        const profile = await getUserProfile(user.uid)
        setApps(allApps)
        setPurchasedApps(purchased)
        setUserProfile(profile)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-purple-400">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {userProfile?.name}!</h1>
          <p className="text-gray-400">Your personal app dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400">{purchasedApps.length}</div>
            <div className="text-gray-400">Apps Purchased</div>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-pink-400">{apps.length}</div>
            <div className="text-gray-400">Available Apps</div>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-cyan-400">Premium</div>
            <div className="text-gray-400">Subscription</div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.filter(app => purchasedApps.includes(app.id)).map((app) => (
              <div key={app.id} className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition">
                <div className="text-4xl mb-4">{app.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{app.description}</p>
                <button className="w-full py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/40 transition font-semibold">
                  Open App
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
