import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import { getComments, createComment } from '@/services/api/commentService'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const CommentSection = ({ entityId, entityType }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadComments = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getComments(entityId, entityType)
      setComments(data)
    } catch (err) {
      setError('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [entityId, entityType])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      setSubmitting(true)
      const comment = await createComment({
        entityId,
        entityType,
        content: newComment.trim(),
        userId: 'current-user',
        createdAt: new Date().toISOString()
      })
      
      setComments(prev => [comment, ...prev])
      setNewComment('')
      toast.success('Comment added successfully')
    } catch (err) {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
        <Error message={error} onRetry={loadComments} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add comment form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="MessageCircle" size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No comments yet</p>
            <p className="text-gray-400 text-xs">Be the first to add a comment</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex space-x-3"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {comment.userId?.substring(0, 2).toUpperCase() || 'UN'}
                </span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.userId || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection