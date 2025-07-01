import ApperIcon from '@/components/ApperIcon'

const StatusBadge = ({ status, type = 'default', showIcon = false }) => {
  const getStatusConfig = () => {
    if (type === 'bug') {
      switch (status?.toLowerCase()) {
        case 'new':
          return { className: 'status-new', icon: 'Circle' }
        case 'in progress':
          return { className: 'status-in-progress', icon: 'Clock' }
        case 'testing':
          return { className: 'status-testing', icon: 'TestTube' }
        case 'resolved':
          return { className: 'status-resolved', icon: 'CheckCircle' }
        case 'closed':
          return { className: 'status-closed', icon: 'XCircle' }
        default:
          return { className: 'status-new', icon: 'Circle' }
      }
    } else if (type === 'testcase') {
      switch (status?.toLowerCase()) {
        case 'passed':
          return { className: 'status-passed', icon: 'CheckCircle' }
        case 'failed':
          return { className: 'status-failed', icon: 'XCircle' }
        case 'pending':
          return { className: 'status-pending', icon: 'Clock' }
        default:
          return { className: 'status-pending', icon: 'Clock' }
      }
    } else if (type === 'priority') {
      switch (status?.toLowerCase()) {
        case 'high':
          return { className: 'priority-high', icon: 'ArrowUp' }
        case 'medium':
          return { className: 'priority-medium', icon: 'Minus' }
        case 'low':
          return { className: 'priority-low', icon: 'ArrowDown' }
        default:
          return { className: 'priority-medium', icon: 'Minus' }
      }
    }
    
    return { className: 'status-new', icon: 'Circle' }
  }

  const { className, icon } = getStatusConfig()

  return (
    <span className={`status-badge ${className}`}>
      {showIcon && <ApperIcon name={icon} size={12} className="mr-1" />}
      {status}
    </span>
  )
}

export default StatusBadge