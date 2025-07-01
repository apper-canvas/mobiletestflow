import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import CommentSection from '@/components/molecules/CommentSection'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getTestCaseById, updateTestCaseStatus } from '@/services/api/testCaseService'
import { getProjectById } from '@/services/api/projectService'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'

const TestCaseDetail = () => {
  const { id } = useParams()
  const [testCase, setTestCase] = useState(null)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTestCaseData = async () => {
    try {
      setLoading(true)
      setError('')
      const testCaseData = await getTestCaseById(parseInt(id))
      setTestCase(testCaseData)
      
      if (testCaseData.projectId) {
        const projectData = await getProjectById(testCaseData.projectId)
        setProject(projectData)
      }
    } catch (err) {
      setError('Failed to load test case details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestCaseData()
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateTestCaseStatus(testCase.Id, newStatus)
      setTestCase(prev => ({ ...prev, status: newStatus }))
      toast.success('Test case status updated')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Loading rows={4} />
      </div>
    )
  }

  if (error || !testCase) {
    return (
      <div className="p-6">
        <Error message={error || 'Test case not found'} onRetry={loadTestCaseData} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/test-cases" className="hover:text-gray-700">Test Cases</Link>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="truncate">{testCase.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {testCase.title}
            </h1>
            <p className="text-gray-600">{testCase.description}</p>
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
                  {testCase.status !== 'passed' && (
                    <button
                      onClick={() => handleStatusUpdate('passed')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mark as Passed
                    </button>
                  )}
                  {testCase.status !== 'failed' && (
                    <button
                      onClick={() => handleStatusUpdate('failed')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mark as Failed
                    </button>
                  )}
                  {testCase.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate('pending')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mark as Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <StatusBadge status={testCase.status} type="testcase" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <StatusBadge status={testCase.priority} type="priority" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
            <span className="text-sm text-gray-900">
              {formatDistanceToNow(new Date(testCase.updatedAt || testCase.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Case Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Steps */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Steps</h2>
            {testCase.steps && testCase.steps.length > 0 ? (
              <div className="space-y-3">
                {testCase.steps.map((step, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{step.action || step}</p>
                      {step.expected && (
                        <p className="text-sm text-gray-600 mt-1">Expected: {step.expected}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="List" size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No test steps defined</p>
              </div>
            )}
          </div>

          {/* Expected Results */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Expected Results</h2>
            {testCase.expectedResult ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700">{testCase.expectedResult}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Target" size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No expected results defined</p>
              </div>
            )}
          </div>

          {/* Execution History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Execution History</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  testCase.status === 'passed' ? 'bg-green-100' :
                  testCase.status === 'failed' ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  <ApperIcon 
                    name={
                      testCase.status === 'passed' ? 'CheckCircle' :
                      testCase.status === 'failed' ? 'XCircle' :
                      'Clock'
                    } 
                    size={16} 
                    className={
                      testCase.status === 'passed' ? 'text-green-600' :
                      testCase.status === 'failed' ? 'text-red-600' :
                      'text-gray-600'
                    }
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Test case status changed to <strong>{testCase.status}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(testCase.updatedAt || testCase.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="accent"
                size="small"
                icon="Play"
                className="w-full justify-center"
                onClick={() => handleStatusUpdate('in-progress')}
              >
                Execute Test
              </Button>
              <Button
                variant="secondary"
                size="small"
                icon="Bug"
                className="w-full justify-center"
              >
                Report Bug
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

          {/* Test Case Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Case Info</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <span className="text-sm text-gray-900">TC-{testCase.Id}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assignee</label>
                <span className="text-sm text-gray-900">{testCase.assigneeId || 'Unassigned'}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <span className="text-sm text-gray-900">
                  {formatDistanceToNow(new Date(testCase.createdAt), { addSuffix: true })}
                </span>
              </div>
              {testCase.moduleId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module</label>
                  <span className="text-sm text-gray-900">{testCase.moduleId}</span>
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
              <Link
                to="/bugs"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ApperIcon name="Bug" size={16} />
                <span>Related Bugs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <CommentSection entityId={testCase.Id.toString()} entityType="testcase" />
      </div>
    </div>
  )
}

export default TestCaseDetail