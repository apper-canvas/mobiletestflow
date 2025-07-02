const bugService = {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "severity" } },
          { field: { Name: "assignee_id" } },
          { field: { Name: "reporter_id" } },
          { field: { Name: "environment" } },
          { field: { Name: "steps_to_reproduce" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "project_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "test_case_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "updated_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('bug', params)
      
      if (!response.success) {
        console.error("Error fetching bugs:", response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching bugs:", error?.response?.data?.message)  
      } else {
        console.error("Error fetching bugs:", error.message)
      }
      return []
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "severity" } },
          { field: { Name: "assignee_id" } },
          { field: { Name: "reporter_id" } },
          { field: { Name: "environment" } },
          { field: { Name: "steps_to_reproduce" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "project_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "test_case_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      }
      
      const response = await apperClient.getRecordById('bug', id, params)
      
      if (!response.success || !response.data) {
        console.error("Bug not found")
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching bug with ID ${id}:`, error?.response?.data?.message)  
      } else {
        console.error(`Error fetching bug with ID ${id}:`, error.message)
      }
      return null
    }
  },

  create: async (bugData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: bugData.title,
          title: bugData.title,
          description: bugData.description,
          status: bugData.status,
          priority: bugData.priority,
          severity: bugData.severity,
          assignee_id: bugData.assigneeId,
          reporter_id: bugData.reporterId,
          environment: bugData.environment,
          steps_to_reproduce: bugData.stepsToReproduce,
          project_id: parseInt(bugData.projectId),
          test_case_id: bugData.testCaseId ? parseInt(bugData.testCaseId) : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord('bug', params)
      
      if (!response.success) {
        console.error("Error creating bug:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} bugs:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating bug:", error?.response?.data?.message)  
      } else {
        console.error("Error creating bug:", error.message)
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
          Name: updateData.title,
          title: updateData.title,
          description: updateData.description,
          status: updateData.status,
          priority: updateData.priority,
          severity: updateData.severity,
          assignee_id: updateData.assigneeId,
          reporter_id: updateData.reporterId,
          environment: updateData.environment,
          steps_to_reproduce: updateData.stepsToReproduce,
          project_id: updateData.projectId ? parseInt(updateData.projectId) : null,
          test_case_id: updateData.testCaseId ? parseInt(updateData.testCaseId) : null,
          updated_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.updateRecord('bug', params)
      
      if (!response.success) {
        console.error("Error updating bug:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} bugs:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating bug:", error?.response?.data?.message)  
      } else {
        console.error("Error updating bug:", error.message)
      }
      return null
    }
  },

  updateStatus: async (id, status) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Id: id,
          status: status,
          updated_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.updateRecord('bug', params)
      
      if (!response.success) {
        console.error("Error updating bug status:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating bug status:", error?.response?.data?.message)  
      } else {
        console.error("Error updating bug status:", error.message)
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
      
      const response = await apperClient.deleteRecord('bug', params)
      
      if (!response.success) {
        console.error("Error deleting bug:", response.message)
        return false
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting bug:", error?.response?.data?.message)  
      } else {
        console.error("Error deleting bug:", error.message)
      }
      return false
    }
  }
}

export const getBugs = bugService.getAll
export const getBugById = bugService.getById
export const createBug = bugService.create
export const updateBug = bugService.update
export const updateBugStatus = bugService.updateStatus
export const deleteBug = bugService.delete