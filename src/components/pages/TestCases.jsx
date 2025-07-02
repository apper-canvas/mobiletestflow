import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FilterBar from "@/components/molecules/FilterBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { getProjects } from "@/services/api/projectService";
import { createTestCase, getTestCases, updateTestCase, updateTestCaseStatus } from "@/services/api/testCaseService";

const TestCases = () => {
  const [testCases, setTestCases] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTestCase, setEditingTestCase] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: ''
  })

  const loadTestCases = async () => {
    try {
      setLoading(true)
      setError('')
      const [testCasesData, projectsData] = await Promise.all([
        getTestCases(),
        getProjects()
      ])
      setTestCases(testCasesData)
      setProjects(projectsData)
    } catch (err) {
      setError('Failed to load test cases')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestCases()
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ status: '', priority: '', project: '' })
  }

const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateTestCaseStatus(id, newStatus)
      setTestCases(prev => 
        prev.map(tc => 
          tc.Id === id ? { ...tc, status: newStatus } : tc
        )
      )
      toast.success('Test case status updated')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleEditTestCase = (testCase) => {
    setEditingTestCase(testCase)
    setShowEditModal(true)
  }

  const filteredTestCases = testCases.filter(tc => {
    if (filters.status && tc.status?.toLowerCase() !== filters.status.toLowerCase()) return false
    if (filters.priority && tc.priority?.toLowerCase() !== filters.priority.toLowerCase()) return false
    if (filters.project && tc.projectId?.toString() !== filters.project) return false
    return true
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Cases</h1>
          <p className="text-gray-600 mt-2">Manage and execute your test cases</p>
        </div>
        <Loading rows={4} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Cases</h1>
          <p className="text-gray-600 mt-2">Manage and execute your test cases</p>
        </div>
        <Error message={error} onRetry={loadTestCases} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Test Cases
          </h1>
          <p className="text-gray-600 mt-2">Manage and execute your test cases</p>
        </div>
        
        <Button
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
          className="shadow-lg"
        >
          New Test Case
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Test Cases Table */}
      {filteredTestCases.length === 0 ? (
        <Empty
          title="No test cases found"
          description={testCases.length === 0 
            ? "Create your first test case to start testing your application features"
            : "No test cases match your current filters. Try adjusting your search criteria."
          }
          icon="FileCheck"
          actionText={testCases.length === 0 ? "Create Test Case" : undefined}
          onAction={testCases.length === 0 ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Case
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
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTestCases.map((testCase, index) => {
                  const project = projects.find(p => p.Id === testCase.projectId)
                  
                  return (
                    <motion.tr
                      key={testCase.Id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            to={`/test-cases/${testCase.Id}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {testCase.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {testCase.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {project?.name || 'Unknown Project'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={testCase.status} type="testcase" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={testCase.priority} type="priority" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(testCase.updatedAt || testCase.createdAt), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Status update buttons */}
                          {testCase.status !== 'passed' && (
                            <button
                              onClick={() => handleStatusUpdate(testCase.Id, 'passed')}
                              className="p-1 rounded-md text-green-600 hover:bg-green-100 transition-colors"
                              title="Mark as Passed"
                            >
                              <ApperIcon name="CheckCircle" size={16} />
                            </button>
                          )}
                          {testCase.status !== 'failed' && (
                            <button
                              onClick={() => handleStatusUpdate(testCase.Id, 'failed')}
                              className="p-1 rounded-md text-red-600 hover:bg-red-100 transition-colors"
                              title="Mark as Failed"
                            >
                              <ApperIcon name="XCircle" size={16} />
                            </button>
                          )}
<button
                            onClick={() => handleEditTestCase(testCase)}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Edit Test Case"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </button>
                          <Link
                            to={`/test-cases/${testCase.Id}`}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            title="View Details"
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

      {/* Create Test Case Modal */}
      {showCreateModal && (
        <CreateTestCaseModal
          projects={projects}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newTestCase) => {
            setTestCases(prev => [newTestCase, ...prev])
            setShowCreateModal(false)
            toast.success('Test case created successfully')
          }}
/>
      )}

      {/* Edit Test Case Modal */}
      {showEditModal && editingTestCase && (
        <EditTestCaseModal
          testCase={editingTestCase}
          projects={projects}
          onClose={() => {
            setShowEditModal(false)
            setEditingTestCase(null)
          }}
          onSuccess={(updatedTestCase) => {
            setTestCases(prev => 
              prev.map(tc => 
                tc.Id === updatedTestCase.Id ? updatedTestCase : tc
              )
            )
            setShowEditModal(false)
            setEditingTestCase(null)
            toast.success('Test case updated successfully')
          }}
        />
      )}
    </div>
  )
}

const CreateTestCaseModal = ({ projects, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    moduleId: '',
    steps: [],
    expectedResult: '',
    priority: 'medium',
    assigneeId: 'current-user'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.projectId) return

    try {
      setLoading(true)
      const testCase = await createTestCase({
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      onSuccess(testCase)
    } catch (err) {
      toast.error('Failed to create test case')
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
          <h3 className="text-lg font-semibold text-gray-900">Create New Test Case</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name="X" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Case Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter test case title"
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
              rows={3}
              placeholder="Describe the test case"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Result
            </label>
            <textarea
              value={formData.expectedResult}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedResult: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Describe the expected outcome"
            />
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
              Create Test Case
            </Button>
          </div>
        </form>
</motion.div>
    </motion.div>
  )
}

const EditTestCaseModal = ({ testCase, projects, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: testCase.title || '',
    description: testCase.description || '',
    projectId: testCase.projectId || '',
    moduleId: testCase.moduleId || '',
    steps: testCase.steps || [],
    expectedResult: testCase.expectedResult || '',
    priority: testCase.priority || 'medium',
    assigneeId: testCase.assigneeId || 'current-user'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.projectId) return

    try {
      setLoading(true)
      const updatedTestCase = await updateTestCase(testCase.Id, {
        ...formData,
        updatedAt: new Date().toISOString()
      })
      onSuccess(updatedTestCase)
    } catch (err) {
      toast.error('Failed to update test case')
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
          <h3 className="text-lg font-semibold text-gray-900">Edit Test Case</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name="X" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Case Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter test case title"
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
              rows={3}
              placeholder="Describe the test case"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Result
            </label>
            <textarea
              value={formData.expectedResult}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedResult: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Describe the expected outcome"
            />
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
              Update Test Case
            </Button>
          </div>
        </form>
</motion.div>
    </motion.div>
  )
}

export default TestCases