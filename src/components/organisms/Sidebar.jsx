import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    exact: true
  },
  {
    name: 'Projects',
    path: '/projects',
    icon: 'FolderOpen'
  },
  {
    name: 'Test Cases',
    path: '/test-cases',
    icon: 'FileCheck'
  },
  {
    name: 'Bugs',
    path: '/bugs',
    icon: 'Bug'
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: 'BarChart3'
  }
]

const Sidebar = ({ onClose }) => {
  const location = useLocation()

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="TestTube" size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            TestFlow Pro
          </span>
        </div>
        
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          <ApperIcon name="X" size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive: routerIsActive }) => {
              const active = item.exact ? 
                isActive(item.path, true) : 
                routerIsActive || isActive(item.path)
              
              return `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-4 border-primary-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }}
          >
            {({ isActive: routerIsActive }) => {
              const active = item.exact ? 
                isActive(item.path, true) : 
                routerIsActive || isActive(item.path)
              
              return (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={active ? 'text-primary-600' : 'text-gray-500'} 
                  />
                  <span className="font-medium">{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )
            }}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <ApperIcon name="HelpCircle" size={16} />
          <span>Help & Support</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar