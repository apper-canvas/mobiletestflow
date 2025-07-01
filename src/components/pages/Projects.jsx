import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getProjects, createProject, deleteProject } from '@/services/api/projectService'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      await deleteProject(id)
      setProjects(prev => prev.filter(p => p.Id !== id))
      toast.success('Project deleted successfully')
    } catch (err) {
      toast.error('Failed to delete project')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your testing projects and modules</p>
        </div>
        <Loading rows={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your testing projects and modules</p>
        </div>
        <Error message={error} onRetry={loadProjects} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-gray-600 mt-2">Manage your testing projects and modules</p>
        </div>
        
        <Button
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
          className="shadow-lg"
        >
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Empty
          title="No projects yet"
          description="Create your first project to start organizing your test cases and tracking bugs"
          icon="FolderOpen"
          actionText="Create Project"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    <Link to={`/projects/${project.Id}`}>
                      {project.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                
                <div className="relative">
                  <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                    <ApperIcon name="MoreVertical" size={16} />
                  </button>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{project.testCases?.length || 0}</div>
                  <div className="text-xs text-gray-500">Test Cases</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{project.bugs?.length || 0}</div>
                  <div className="text-xs text-gray-500">Bugs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{project.modules?.length || 0}</div>
                  <div className="text-xs text-gray-500">Modules</div>
                </div>
              </div>

              {/* Status and Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{project.completionPercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.completionPercentage || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <ApperIcon name="Calendar" size={12} />
                  <span>
                    Updated {formatDistanceToNow(new Date(project.updatedAt || project.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status || 'Active'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newProject) => {
            setProjects(prev => [newProject, ...prev])
            setShowCreateModal(false)
            toast.success('Project created successfully')
          }}
        />
      )}
    </div>
  )
}

const CreateProjectModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      setLoading(true)
      const project = await createProject({
        ...formData,
        createdAt: new Date().toISOString(),
        modules: [],
        testCases: [],
        bugs: [],
        completionPercentage: 0
      })
      onSuccess(project)
    } catch (err) {
      toast.error('Failed to create project')
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
        className="bg-white rounded-xl shadow-large max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
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
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter project name"
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
              placeholder="Enter project description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
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
              disabled={!formData.name.trim()}
            >
              Create Project
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default Projects