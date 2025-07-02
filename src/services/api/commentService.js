const commentService = {
  getByEntity: async (entityId, entityType) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "entity_id" } },
          { field: { Name: "entity_type" } },
          { field: { Name: "content" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          { FieldName: "entity_id", Operator: "EqualTo", Values: [entityId] },
          { FieldName: "entity_type", Operator: "EqualTo", Values: [entityType] }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('app_Comment', params)
      
      if (!response.success) {
        console.error("Error fetching comments:", response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching comments:", error?.response?.data?.message)  
      } else {
        console.error("Error fetching comments:", error.message)
      }
      return []
    }
  },

  create: async (commentData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: `Comment on ${commentData.entityType} ${commentData.entityId}`,
          entity_id: commentData.entityId,
          entity_type: commentData.entityType,
          content: commentData.content,
          user_id: commentData.userId,
          created_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord('app_Comment', params)
      
      if (!response.success) {
        console.error("Error creating comment:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} comments:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating comment:", error?.response?.data?.message)  
      } else {
        console.error("Error creating comment:", error.message)
      }
      return null
    }
  },

  update: async (id, updateData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Id: id,
          content: updateData.content
        }]
      }
      
      const response = await apperClient.updateRecord('app_Comment', params)
      
      if (!response.success) {
        console.error("Error updating comment:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} comments:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating comment:", error?.response?.data?.message)  
      } else {
        console.error("Error updating comment:", error.message)
      }
      return null
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord('app_Comment', params)
      
      if (!response.success) {
        console.error("Error deleting comment:", response.message)
        return false
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting comment:", error?.response?.data?.message)  
      } else {
        console.error("Error deleting comment:", error.message)
      }
      return false
    }
  }
}

export const getComments = commentService.getByEntity
export const createComment = commentService.create
export const updateComment = commentService.update
export const deleteComment = commentService.delete