import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import FilterBar from '@/components/molecules/FilterBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getBugs, createBug, updateBugStatus } from '@/services/api/bugService'
import { getProjects } from '@/services/api/projectService'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'

const Bugs = () => {
  const [bugs, setBugs] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: ''
  })

  const loadBugs = async () => {
    try {
      setLoading(true)
      setError('')
      const [bugsData, projectsData] = await Promise.all([
        getBugs(),
        getProjects()
      ])
      setBugs(bugsData)
      setProjects(projectsData)
    } catch (err) {
      setError('Failed to load bugs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBugs()
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ status: '', priority: '', project: '' })
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBugStatus(id, newStatus)
      setBugs(prev => 
        prev.map(bug => 
          bug.Id === id ? { ...bug, status: newStatus } : bug
        )
      )
      toast.success('Bug status updated')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const filteredBugs = bugs.filter(bug => {
    if (filters.status && bug.status?.toLowerCase() !== filters.status.toLowerCase()) return false
    if (filters.priority && bug.priority?.toLowerCase() !== filters.priority.toLowerCase()) return false
    if (filters.project && bug.projectId?.toString() !== filters.project) return false
    return true
  })

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bugs</h1>
          <p className="text-gray-600 mt-2">Track and manage bug reports</p>
        </div>
        <Loading rows={4} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bugs</h1>
          <p className="text-gray-600 mt-2">Track and manage bug reports</p>
        </div>
        <Error message={error} onRetry={loadBugs} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Bugs
          </h1>
          <p className="text-gray-600 mt-2">Track and manage bug reports</p>
        </div>
        
        <Button
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
          className="shadow-lg"
        >
          Report Bug
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Bugs Table */}
      {filteredBugs.length === 0 ? (
        <Empty
          title="No bugs found"
          description={bugs.length === 0 
            ? "No bugs reported yet. That's great news for your application quality!"
            : "No bugs match your current filters. Try adjusting your search criteria."
          }
          icon="Bug"
          actionText={bugs.length === 0 ? "Report Bug" : undefined}
          onAction={bugs.length === 0 ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bug Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBugs.map((bug, index) => {
                  const project = projects.find(p => p.Id === bug.projectId)
                  
                  return (
                    <motion.tr
                      key={bug.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            to={`/bugs/${bug.Id}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {bug.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {bug.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {project?.name || 'Unknown Project'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={bug.status} type="bug" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={bug.priority} type="priority" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge ${getSeverityColor(bug.severity)}`}>
                          {bug.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {bug.reporterId || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Quick status update */}
                          <div className="relative group">
                            <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                              <ApperIcon name="MoreHorizontal" size={16} />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <div className="py-1">
                                {bug.status !== 'in progress' && (
                                  <button
                                    onClick={() => handleStatusUpdate(bug.Id, 'in progress')}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Mark In Progress
                                  </button>
                                )}
                                {bug.status !== 'resolved' && (
                                  <button
                                    onClick={() => handleStatusUpdate(bug.Id, 'resolved')}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Mark Resolved
                                  </button>
                                )}
                                {bug.status !== 'closed' && (
                                  <button
                                    onClick={() => handleStatusUpdate(bug.Id, 'closed')}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Close Bug
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/bugs/${bug.Id}`}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <ApperIcon name="Eye" size={16} />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Bug Modal */}
      {showCreateModal && (
        <CreateBugModal
          projects={projects}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newBug) => {
            setBugs(prev => [newBug, ...prev])
            setShowCreateModal(false)
            toast.success('Bug reported successfully')
          }}
        />
      )}
    </div>
  )
}

const CreateBugModal = ({ projects, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    testCaseId: '',
    priority: 'medium',
    severity: 'medium',
    assigneeId: '',
    reporterId: 'current-user'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.projectId) return

    try {
      setLoading(true)
      const bug = await createBug({
        ...formData,
        status: 'new',
        createdAt: new Date().toISOString()
      })
      onSuccess(bug)
    } catch (err) {
      toast.error('Failed to create bug report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-large max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Report New Bug</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name="X" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.Id} value={project.Id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bug Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter bug title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Describe the bug in detail"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.title.trim() || !formData.projectId}
            >
              Report Bug
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default Bugs