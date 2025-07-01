import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import { getNotifications, markNotificationAsRead } from '@/services/api/notificationService'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getNotifications()
      setNotifications(data)
    } catch (err) {
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => 
        prev.map(notif => 
          notif.Id === id ? { ...notif, read: true } : notif
        )
      )
      toast.success('Notification marked as read')
    } catch (err) {
      toast.error('Failed to mark notification as read')
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'bug_assigned':
        return 'Bug'
      case 'test_case_updated':
        return 'FileCheck'
      case 'project_created':
        return 'FolderPlus'
      case 'comment_added':
        return 'MessageCircle'
      default:
        return 'Bell'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-large border border-gray-200 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <ApperIcon name="X" size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <Loading />
          </div>
        ) : error ? (
          <div className="p-4">
            <Error message={error} onRetry={loadNotifications} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <ApperIcon name="Bell" size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="py-2">
            {notifications.map((notification) => (
              <motion.div
                key={notification.Id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-primary-500' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  !notification.read ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <ApperIcon 
                    name={getNotificationIcon(notification.type)} 
                    size={16} 
                    className={!notification.read ? 'text-primary-600' : 'text-gray-600'} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.Id)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <ApperIcon name="Check" size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium py-1">
          View all notifications
        </button>
      </div>
    </motion.div>
  )
}

export default NotificationDropdown