import projectsData from '../mockData/projects.json'

let projects = [...projectsData]

const projectService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...projects]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150))
    const project = projects.find(p => p.Id === id)
    if (!project) {
      throw new Error('Project not found')
    }
    return { ...project }
  },

  create: async (projectData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...projects.map(p => p.Id), 0)
    const newProject = {
      ...projectData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    projects.unshift(newProject)
    return { ...newProject }
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = projects.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    projects[index] = {
      ...projects[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...projects[index] }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = projects.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    projects.splice(index, 1)
    return true
  }
}

export const getProjects = projectService.getAll
export const getProjectById = projectService.getById
export const createProject = projectService.create
export const updateProject = projectService.update
export const deleteProject = projectService.delete