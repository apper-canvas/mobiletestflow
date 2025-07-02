const testCaseService = {
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
          { field: { Name: "steps" } },
          { field: { Name: "expected_result" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "assignee_id" } },
          { field: { Name: "module_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "project_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "updated_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('test_case', params)
      
      if (!response.success) {
        console.error("Error fetching test cases:", response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching test cases:", error?.response?.data?.message)  
      } else {
        console.error("Error fetching test cases:", error.message)
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
          { field: { Name: "steps" } },
          { field: { Name: "expected_result" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "assignee_id" } },
          { field: { Name: "module_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { 
            field: { name: "project_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      }
      
      const response = await apperClient.getRecordById('test_case', id, params)
      
      if (!response.success || !response.data) {
        console.error("Test case not found")
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching test case with ID ${id}:`, error?.response?.data?.message)  
      } else {
        console.error(`Error fetching test case with ID ${id}:`, error.message)
      }
      return null
    }
  },

  create: async (testCaseData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: testCaseData.title,
          title: testCaseData.title,
          description: testCaseData.description,
          steps: testCaseData.steps ? JSON.stringify(testCaseData.steps) : "",
          expected_result: testCaseData.expectedResult,
          status: testCaseData.status,
          priority: testCaseData.priority,
          assignee_id: testCaseData.assigneeId,
          module_id: testCaseData.moduleId,
          project_id: parseInt(testCaseData.projectId),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord('test_case', params)
      
      if (!response.success) {
        console.error("Error creating test case:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} test cases:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating test case:", error?.response?.data?.message)  
      } else {
        console.error("Error creating test case:", error.message)
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
          steps: updateData.steps ? JSON.stringify(updateData.steps) : "",
          expected_result: updateData.expectedResult,
          priority: updateData.priority,
          assignee_id: updateData.assigneeId,
          module_id: updateData.moduleId,
          project_id: updateData.projectId ? parseInt(updateData.projectId) : null,
          updated_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.updateRecord('test_case', params)
      
      if (!response.success) {
        console.error("Error updating test case:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} test cases:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating test case:", error?.response?.data?.message)  
      } else {
        console.error("Error updating test case:", error.message)
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
      
      const response = await apperClient.updateRecord('test_case', params)
      
      if (!response.success) {
        console.error("Error updating test case status:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating test case status:", error?.response?.data?.message)  
      } else {
        console.error("Error updating test case status:", error.message)
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
      
      const response = await apperClient.deleteRecord('test_case', params)
      
      if (!response.success) {
        console.error("Error deleting test case:", response.message)
        return false
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting test case:", error?.response?.data?.message)  
      } else {
        console.error("Error deleting test case:", error.message)
      }
      return false
    }
  }
}

export const getTestCases = testCaseService.getAll
export const getTestCaseById = testCaseService.getById
export const createTestCase = testCaseService.create
export const updateTestCase = testCaseService.update
export const updateTestCaseStatus = testCaseService.updateStatus
export const deleteTestCase = testCaseService.delete