import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = () => {
  const [query, setQuery] = useState('')

  return (
    <div className="relative w-96">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects, test cases, bugs..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
  )
}

export default SearchBar