const projectService = {
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
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "completion_percentage" } },
          { field: { Name: "modules" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [
          { fieldName: "updated_at", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('project', params)
      
      if (!response.success) {
        console.error("Error fetching projects:", response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message)  
      } else {
        console.error("Error fetching projects:", error.message)
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
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "completion_percentage" } },
          { field: { Name: "modules" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      }
      
      const response = await apperClient.getRecordById('project', id, params)
      
      if (!response.success || !response.data) {
        console.error("Project not found")
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message)  
      } else {
        console.error(`Error fetching project with ID ${id}:`, error.message)
      }
      return null
    }
  },

  create: async (projectData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          completion_percentage: projectData.completionPercentage || 0,
          modules: projectData.modules ? JSON.stringify(projectData.modules) : "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord('project', params)
      
      if (!response.success) {
        console.error("Error creating project:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} projects:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message)  
      } else {
        console.error("Error creating project:", error.message)
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
          Name: updateData.name,
          description: updateData.description,
          status: updateData.status,
          completion_percentage: updateData.completionPercentage,
          modules: updateData.modules ? JSON.stringify(updateData.modules) : "",
          updated_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.updateRecord('project', params)
      
      if (!response.success) {
        console.error("Error updating project:", response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} projects:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message)  
      } else {
        console.error("Error updating project:", error.message)
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
      
      const response = await apperClient.deleteRecord('project', params)
      
      if (!response.success) {
        console.error("Error deleting project:", response.message)
        return false
      }
      
      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message)  
      } else {
        console.error("Error deleting project:", error.message)
      }
      return false
    }
  }
}

export const getProjects = projectService.getAll
export const getProjectById = projectService.getById
export const createProject = projectService.create
export const updateProject = projectService.update
export const deleteProject = projectService.delete