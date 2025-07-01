import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import NotificationDropdown from '@/components/molecules/NotificationDropdown'
import SearchBar from '@/components/molecules/SearchBar'

const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false)

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

        <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
          <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">QA Lead</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header