import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import CommentSection from '@/components/molecules/CommentSection'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getBugById, updateBugStatus } from '@/services/api/bugService'
import { getProjectById } from '@/services/api/projectService'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'

const BugDetail = () => {
  const { id } = useParams()
  const [bug, setBug] = useState(null)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBugData = async () => {
    try {
      setLoading(true)
      setError('')
      const bugData = await getBugById(parseInt(id))
      setBug(bugData)
      
      if (bugData.projectId) {
        const projectData = await getProjectById(bugData.projectId)
        setProject(projectData)
      }
    } catch (err) {
      setError('Failed to load bug details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBugData()
  }, [id])

const handleStatusUpdate = async (newStatus) => {
    try {
      await updateBugStatus(bug.Id, newStatus)
      setBug(prev => ({ ...prev, status: newStatus }))
      toast.success('Bug status updated')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

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
        <Loading rows={4} />
      </div>
    )
  }

  if (error || !bug) {
    return (
      <div className="p-6">
        <Error message={error || 'Bug not found'} onRetry={loadBugData} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/bugs" className="hover:text-gray-700">Bugs</Link>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="truncate">{bug.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {bug.title}
              </h1>
              <span className="text-lg text-gray-500">#{bug.Id}</span>
            </div>
            <p className="text-gray-600">{bug.description}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" icon="Edit">
              Edit
            </Button>
            <div className="relative group">
              <Button variant="ghost" icon="MoreHorizontal">
                Actions
              </Button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  {bug.status !== 'in progress' && (
                    <button
                      onClick={() => handleStatusUpdate('in progress')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Start Working
                    </button>
                  )}
                  {bug.status !== 'testing' && (
                    <button
                      onClick={() => handleStatusUpdate('testing')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mark for Testing
                    </button>
                  )}
                  {bug.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusUpdate('resolved')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {bug.status !== 'closed' && (
                    <button
                      onClick={() => handleStatusUpdate('closed')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Close Bug
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <StatusBadge status={bug.status} type="bug" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <StatusBadge status={bug.priority} type="priority" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <span className={`status-badge ${getSeverityColor(bug.severity)}`}>
              {bug.severity}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <Link
              to={`/projects/${project?.Id}`}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {project?.name || 'Unknown Project'}
            </Link>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reported</label>
            <span className="text-sm text-gray-900">
              {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bug Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{bug.description}</p>
            </div>
          </div>

          {/* Steps to Reproduce */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Steps to Reproduce</h2>
            {bug.stepsToReproduce ? (
              <div className="space-y-3">
                {bug.stepsToReproduce.split('\n').map((step, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-gray-900">{step}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="List" size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No reproduction steps provided</p>
              </div>
            )}
          </div>

          {/* Bug History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bug History</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Plus" size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Bug reported by <strong>{bug.reporterId}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              {bug.status !== 'new' && (
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    bug.status === 'resolved' ? 'bg-green-100' :
                    bug.status === 'in progress' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    <ApperIcon 
                      name={
                        bug.status === 'resolved' ? 'CheckCircle' :
                        bug.status === 'in progress' ? 'Clock' :
                        'Circle'
                      } 
                      size={16} 
                      className={
                        bug.status === 'resolved' ? 'text-green-600' :
                        bug.status === 'in progress' ? 'text-yellow-600' :
                        'text-gray-600'
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      Status changed to <strong>{bug.status}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(bug.updatedAt || bug.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {bug.status === 'new' && (
                <Button
                  variant="accent"
                  size="small"
                  icon="Play"
                  className="w-full justify-center"
                  onClick={() => handleStatusUpdate('in progress')}
                >
                  Start Working
                </Button>
              )}
              {bug.status === 'in progress' && (
                <Button
                  variant="accent"
                  size="small"
                  icon="TestTube"
                  className="w-full justify-center"
                  onClick={() => handleStatusUpdate('testing')}
                >
                  Ready for Testing
                </Button>
              )}
              {bug.status === 'testing' && (
                <Button
                  variant="accent"
                  size="small"
                  icon="CheckCircle"
                  className="w-full justify-center"
                  onClick={() => handleStatusUpdate('resolved')}
                >
                  Mark Resolved
                </Button>
              )}
              <Button
                variant="secondary"
                size="small"
                icon="FileCheck"
                className="w-full justify-center"
              >
                Create Test Case
              </Button>
              <Button
                variant="ghost"
                size="small"
                icon="Copy"
                className="w-full justify-center"
              >
                Duplicate
              </Button>
            </div>
          </div>

          {/* Bug Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bug Info</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bug ID</label>
                <span className="text-sm text-gray-900">BUG-{bug.Id}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reporter</label>
                <span className="text-sm text-gray-900">{bug.reporterId}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assignee</label>
                <span className="text-sm text-gray-900">{bug.assigneeId || 'Unassigned'}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Environment</label>
                <span className="text-sm text-gray-900">{bug.environment || 'Not specified'}</span>
              </div>
              {bug.testCaseId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Related Test Case</label>
                  <Link
                    to={`/test-cases/${bug.testCaseId}`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    TC-{bug.testCaseId}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Related Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Items</h3>
            <div className="space-y-2">
              <Link
                to={`/projects/${project?.Id}`}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ApperIcon name="FolderOpen" size={16} />
                <span>View Project</span>
              </Link>
              {bug.testCaseId && (
                <Link
                  to={`/test-cases/${bug.testCaseId}`}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ApperIcon name="FileCheck" size={16} />
                  <span>Related Test Case</span>
                </Link>
              )}
              <Link
                to="/bugs"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ApperIcon name="Bug" size={16} />
                <span>All Bugs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <CommentSection entityId={bug.Id.toString()} entityType="bug" />
      </div>
    </div>
  )
}

export default BugDetail