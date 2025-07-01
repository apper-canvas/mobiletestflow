import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="Filter" size={16} />
            <span>Filters</span>
            <ApperIcon name={showFilters ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>

          {Object.values(filters).some(value => value && value !== 'all') && (
            <button
              onClick={onClearFilters}
              className="text-sm text-accent-600 hover:text-accent-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="Search" size={16} />
          <span>Use search to find specific items</span>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) => onFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                value={filters.assignee || ''}
                onChange={(e) => onFilterChange('assignee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Assignees</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
                <option value="mike-johnson">Mike Johnson</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                value={filters.project || ''}
                onChange={(e) => onFilterChange('project', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Projects</option>
                <option value="1">E-commerce Platform</option>
                <option value="2">Mobile Banking App</option>
                <option value="3">CRM System</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterBar