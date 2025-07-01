import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 focus:ring-primary-500 shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500",
    accent: "bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 focus:ring-accent-500 shadow-md hover:shadow-lg",
    danger: "bg-gradient-to-r from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 focus:ring-error-500 shadow-md hover:shadow-lg",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500"
  }
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  }
  
  const iconSizes = {
    small: 14,
    medium: 16,
    large: 18
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={iconSizes[size]} className="animate-spin mr-2" />
      ) : (
        icon && iconPosition === 'left' && (
          <ApperIcon name={icon} size={iconSizes[size]} className="mr-2" />
        )
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={iconSizes[size]} className="ml-2" />
      )}
    </motion.button>
  )
}

export default Button