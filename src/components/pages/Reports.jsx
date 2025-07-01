import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getReportsData } from '@/services/api/reportsService'

const Reports = () => {
  const [reportsData, setReportsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')

  const loadReportsData = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getReportsData(selectedTimeRange)
      setReportsData(data)
    } catch (err) {
      setError('Failed to load reports data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportsData()
  }, [selectedTimeRange])

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Analytics and insights for your testing activities</p>
        </div>
        <Loading rows={4} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Analytics and insights for your testing activities</p>
        </div>
        <Error message={error} onRetry={loadReportsData} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Reports
          </h1>
          <p className="text-gray-600 mt-2">Analytics and insights for your testing activities</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <ApperIcon name="Download" size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reportsData?.keyMetrics?.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metric.value}</p>
                {metric.change && (
                  <div className={`flex items-center mt-2 text-sm ${
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <ApperIcon 
                      name={metric.change > 0 ? 'TrendingUp' : 'TrendingDown'} 
                      size={14} 
                      className="mr-1" 
                    />
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={metric.icon} size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Test Execution Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Execution Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <ApperIcon name="BarChart3" size={48} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">Chart visualization would be rendered here</p>
            </div>
          </div>
        </motion.div>

        {/* Bug Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bug Status Distribution</h3>
          <div className="space-y-4">
            {reportsData?.bugDistribution?.map((item, index) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'New' ? 'bg-blue-500' :
                    item.status === 'In Progress' ? 'bg-yellow-500' :
                    item.status === 'Testing' ? 'bg-purple-500' :
                    item.status === 'Resolved' ? 'bg-green-500' :
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
      </div>

      {/* Team Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Cases Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Cases Executed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bugs Found
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bugs Resolved
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportsData?.teamPerformance?.map((member, index) => (
                <tr key={member.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.testCasesCreated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.testCasesExecuted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.bugsFound}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.bugsResolved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportsData?.insights?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                insight.type === 'warning' ? 'bg-yellow-100' :
                insight.type === 'success' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                <ApperIcon 
                  name={
                    insight.type === 'warning' ? 'AlertTriangle' :
                    insight.type === 'success' ? 'CheckCircle' :
                    'Info'
                  } 
                  size={16} 
                  className={
                    insight.type === 'warning' ? 'text-yellow-600' :
                    insight.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Reports