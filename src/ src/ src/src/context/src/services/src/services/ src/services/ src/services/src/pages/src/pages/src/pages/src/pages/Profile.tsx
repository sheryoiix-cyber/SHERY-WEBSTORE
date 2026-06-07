import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../services/userService'
import { logoutUser } from '../services/auth'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      try {
        const userProfile = await getUserProfile(user.uid)
        setProfile(userProfile)
        setName(userProfile?.name || '')
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    try {
      await updateUserProfile(user.uid, { name })
      setProfile({ ...profile, name })
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      setUser(null)
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-purple-400">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <img
              src={profile?.avatar}
              alt={profile?.name}
              className="w-24 h-24 rounded-full border-2 border-purple-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">{profile?.name}</h1>
              <p className="text-gray-400">{profile?.email}</p>
              <p className="text-purple-400 capitalize mt-2">{profile?.subscription} plan</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              ) : (
                <p className="text-white">{profile?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
              <p className="text-gray-400">{profile?.email}</p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Member Since</label>
              <p className="text-gray-400">{profile?.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 border border-purple-500/20 text-purple-400 rounded-lg hover:border-purple-500/50 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/40 transition"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-6 py-2 border border-red-500/20 text-red-400 rounded-lg hover:border-red-500/50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
