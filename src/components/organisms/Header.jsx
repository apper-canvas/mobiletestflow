import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import NotificationDropdown from '@/components/molecules/NotificationDropdown'
import SearchBar from '@/components/molecules/SearchBar'

const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="Menu" size={20} />
        </button>
        
        <div className="hidden sm:block">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </AnimatePresence>
        </div>

<div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 pl-3 border-l border-gray-200 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">QA Lead</p>
            </div>
            <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john.doe@company.com</p>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      // Navigate to profile page
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ApperIcon name="User" size={16} className="mr-3 text-gray-400" />
                    View Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      // Navigate to settings page
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ApperIcon name="Settings" size={16} className="mr-3 text-gray-400" />
                    Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      // Navigate to preferences page
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ApperIcon name="Sliders" size={16} className="mr-3 text-gray-400" />
                    Preferences
                  </button>
                </div>
                
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      // Handle logout
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ApperIcon name="LogOut" size={16} className="mr-3 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Header