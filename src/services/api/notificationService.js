const notificationService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "type" } },
          { field: { Name: "message" } },
          { field: { Name: "entity_id" } },
          { field: { Name: "read" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords('app_Notification', params)
      
      if (!response.success) {
        console.error("Error fetching notifications:", response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notifications:", error?.response?.data?.message)  
      } else {
        console.error("Error fetching notifications:", error.message)
      }
      return []
    }
  },

  markAsRead: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Id: id,
          read: true
        }]
      }
      
      const response = await apperClient.updateRecord('app_Notification', params)
      
      if (!response.success) {
        console.error("Error marking notification as read:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking notification as read:", error?.response?.data?.message)  
      } else {
        console.error("Error marking notification as read:", error.message)
      }
      return null
    }
  },

  create: async (notificationData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: notificationData.message,
          user_id: notificationData.userId,
          type: notificationData.type,
          message: notificationData.message,
          entity_id: notificationData.entityId,
          read: false,
          created_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord('app_Notification', params)
      
      if (!response.success) {
        console.error("Error creating notification:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} notifications:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating notification:", error?.response?.data?.message)  
      } else {
        console.error("Error creating notification:", error.message)
      }
      return null
    }
  }
}

export const getNotifications = notificationService.getAll
export const markNotificationAsRead = notificationService.markAsRead
export const createNotification = notificationService.create