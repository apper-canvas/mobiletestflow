import { useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import NotificationDropdown from '@/components/molecules/NotificationDropdown'
import { AuthContext } from '@/App'

const Header = ({ onMenuClick }) => {
  const [showProfile, setShowProfile] = useState(false)
  const { user } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)

  const handleLogout = async () => {
    await logout()
    setShowProfile(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-900">TestFlow Pro</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0] || user?.name?.[0] || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName || user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.emailAddress || user?.email || ''}
                </p>
              </div>
              <ApperIcon name="ChevronDown" size={16} />
            </button>

            {showProfile && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName || user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.emailAddress || user?.email || ''}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <ApperIcon name="LogOut" size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header