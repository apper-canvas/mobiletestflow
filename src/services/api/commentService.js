import commentsData from '../mockData/comments.json'

let comments = [...commentsData]

const commentService = {
  getByEntity: async (entityId, entityType) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return comments
      .filter(c => c.entityId === entityId && c.entityType === entityType)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  create: async (commentData) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const maxId = Math.max(...comments.map(c => c.Id), 0)
    const newComment = {
      ...commentData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    comments.unshift(newComment)
    return { ...newComment }
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = comments.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }
    comments[index] = {
      ...comments[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...comments[index] }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150))
    const index = comments.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }
    comments.splice(index, 1)
    return true
  }
}

export const getComments = commentService.getByEntity
export const createComment = commentService.create
export const updateComment = commentService.update
export const deleteComment = commentService.delete