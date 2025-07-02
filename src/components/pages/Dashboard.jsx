import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getDashboardStats } from '@/services/api/dashboardService'
import { formatDistanceToNow } from 'date-fns'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

const loadDashboardStats = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your testing activities</p>
        </div>
        <Loading rows={4} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your testing activities</p>
        </div>
        <Error message={error} onRetry={loadDashboardStats} />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: 'FolderOpen',
      color: 'from-blue-500 to-blue-600',
      link: '/projects'
    },
    {
      title: 'Test Cases',
      value: stats?.totalTestCases || 0,
      icon: 'FileCheck',
      color: 'from-green-500 to-green-600',
      link: '/test-cases'
    },
    {
      title: 'Active Bugs',
      value: stats?.activeBugs || 0,
      icon: 'Bug',
      color: 'from-red-500 to-red-600',
      link: '/bugs'
    },
    {
      title: 'Test Execution Rate',
      value: `${stats?.testExecutionRate || 0}%`,
      icon: 'TrendingUp',
      color: 'from-purple-500 to-purple-600',
      link: '/reports'
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Overview of your testing activities and progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={card.link}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <ApperIcon name={card.icon} size={24} className="text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Execution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Execution Status</h3>
          <div className="space-y-4">
            {stats?.testExecutionStatus?.map((item, index) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'Passed' ? 'bg-green-500' :
                    item.status === 'Failed' ? 'bg-red-500' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-700">{item.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'bug' ? 'bg-red-100' :
                  activity.type === 'test' ? 'bg-green-100' :
                  'bg-blue-100'
                }`}>
                  <ApperIcon 
                    name={
                      activity.type === 'bug' ? 'Bug' :
                      activity.type === 'test' ? 'FileCheck' :
                      'FolderOpen'
                    } 
                    size={16} 
                    className={
                      activity.type === 'bug' ? 'text-red-600' :
                      activity.type === 'test' ? 'text-green-600' :
                      'text-blue-600'
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/projects"
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Plus" size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">New Project</span>
          </Link>
          
          <Link
            to="/test-cases"
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileCheck" size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">Create Test Case</span>
          </Link>
          
          <Link
            to="/bugs"
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bug" size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">Report Bug</span>
          </Link>
          
          <Link
            to="/reports"
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="BarChart3" size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">View Reports</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard