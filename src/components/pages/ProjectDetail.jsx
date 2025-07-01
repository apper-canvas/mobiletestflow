import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/molecules/StatusBadge'
import CommentSection from '@/components/molecules/CommentSection'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getProjectById } from '@/services/api/projectService'
import { getTestCases } from '@/services/api/testCaseService'
import { getBugs } from '@/services/api/bugService'
import { formatDistanceToNow } from 'date-fns'

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [testCases, setTestCases] = useState([])
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const loadProjectData = async () => {
    try {
      setLoading(true)
      setError('')
      const [projectData, testCasesData, bugsData] = await Promise.all([
        getProjectById(parseInt(id)),
        getTestCases(),
        getBugs()
      ])
      
      setProject(projectData)
      setTestCases(testCasesData.filter(tc => tc.projectId === parseInt(id)))
      setBugs(bugsData.filter(bug => bug.projectId === parseInt(id)))
    } catch (err) {
      setError('Failed to load project details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjectData()
  }, [id])

  if (loading) {
    return (
      <div className="p-6">
        <Loading rows={4} />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <Error message={error || 'Project not found'} onRetry={loadProjectData} />
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'test-cases', label: 'Test Cases', icon: 'FileCheck', count: testCases.length },
    { id: 'bugs', label: 'Bugs', icon: 'Bug', count: bugs.length },
    { id: 'comments', label: 'Comments', icon: 'MessageCircle' }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/projects" className="hover:text-gray-700">Projects</Link>
          <ApperIcon name="ChevronRight" size={16} />
          <span>{project.name}</span>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {project.name}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">{project.description}</p>
            
            <div className="flex items-center space-x-4 mt-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status || 'Active'}
              </div>
              <span className="text-sm text-gray-500">
                Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" icon="Edit">
              Edit Project
            </Button>
            <Button icon="Plus">
              Add Test Case
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Test Cases</p>
              <p className="text-2xl font-bold text-gray-900">{testCases.length}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileCheck" size={20} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bugs</p>
              <p className="text-2xl font-bold text-gray-900">
                {bugs.filter(bug => bug.status !== 'closed').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bug" size={20} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Test Coverage</p>
              <p className="text-2xl font-bold text-gray-900">
                {testCases.length > 0 ? Math.round((testCases.filter(tc => tc.status === 'passed').length / testCases.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={20} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Modules</p>
              <p className="text-2xl font-bold text-gray-900">{project.modules?.length || 0}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" size={20} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <ProjectOverview project={project} testCases={testCases} bugs={bugs} />
          )}
          {activeTab === 'test-cases' && (
            <TestCasesList testCases={testCases} />
          )}
          {activeTab === 'bugs' && (
            <BugsList bugs={bugs} />
          )}
          {activeTab === 'comments' && (
            <CommentSection entityId={project.Id.toString()} entityType="project" />
          )}
        </div>
      </div>
    </div>
  )
}

const ProjectOverview = ({ project, testCases, bugs }) => {
  const passedTests = testCases.filter(tc => tc.status === 'passed').length
  const failedTests = testCases.filter(tc => tc.status === 'failed').length
  const pendingTests = testCases.filter(tc => tc.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Execution Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Execution Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Passed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{passedTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Failed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{failedTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{pendingTests}</span>
            </div>
          </div>
        </div>

        {/* Bug Status Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bug Status Summary</h3>
          <div className="space-y-3">
            {['new', 'in progress', 'testing', 'resolved', 'closed'].map(status => {
              const count = bugs.filter(bug => bug.status?.toLowerCase() === status).length
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'new' ? 'bg-blue-500' :
                      status === 'in progress' ? 'bg-yellow-500' :
                      status === 'testing' ? 'bg-purple-500' :
                      status === 'resolved' ? 'bg-green-500' :
                      'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-700 capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Test case "User Login Validation" passed</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bug" size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">New bug reported: "Payment gateway timeout"</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TestCasesList = ({ testCases }) => {
  return (
    <div className="space-y-4">
      {testCases.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="FileCheck" size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No test cases in this project</p>
        </div>
      ) : (
        testCases.map((testCase) => (
          <div key={testCase.Id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link
                  to={`/test-cases/${testCase.Id}`}
                  className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {testCase.title}
                </Link>
                <p className="text-gray-600 mt-1">{testCase.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <StatusBadge status={testCase.status} type="testcase" />
                  <StatusBadge status={testCase.priority} type="priority" />
                  <span className="text-sm text-gray-500">
                    Updated {formatDistanceToNow(new Date(testCase.updatedAt || testCase.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

const BugsList = ({ bugs }) => {
  return (
    <div className="space-y-4">
      {bugs.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Bug" size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No bugs reported in this project</p>
        </div>
      ) : (
        bugs.map((bug) => (
          <div key={bug.Id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link
                  to={`/bugs/${bug.Id}`}
                  className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {bug.title}
                </Link>
                <p className="text-gray-600 mt-1">{bug.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <StatusBadge status={bug.status} type="bug" />
                  <StatusBadge status={bug.priority} type="priority" />
                  <span className={`status-badge ${
                    bug.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    bug.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    bug.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {bug.severity} severity
                  </span>
                  <span className="text-sm text-gray-500">
                    Reported {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ProjectDetail