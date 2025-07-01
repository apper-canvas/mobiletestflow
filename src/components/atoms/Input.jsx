import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const hasIcon = Boolean(icon)
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            block w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
            ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input