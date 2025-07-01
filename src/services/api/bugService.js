import bugsData from '../mockData/bugs.json'

let bugs = [...bugsData]

const bugService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...bugs]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150))
    const bug = bugs.find(b => b.Id === id)
    if (!bug) {
      throw new Error('Bug not found')
    }
    return { ...bug }
  },

  create: async (bugData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...bugs.map(b => b.Id), 0)
    const newBug = {
      ...bugData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    bugs.unshift(newBug)
    return { ...newBug }
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = bugs.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Bug not found')
    }
    bugs[index] = {
      ...bugs[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...bugs[index] }
  },

  updateStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = bugs.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Bug not found')
    }
    bugs[index] = {
      ...bugs[index],
      status,
      updatedAt: new Date().toISOString()
    }
    return { ...bugs[index] }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = bugs.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Bug not found')
    }
    bugs.splice(index, 1)
    return true
  }
}

export const getBugs = bugService.getAll
export const getBugById = bugService.getById
export const createBug = bugService.create
export const updateBug = bugService.update
export const updateBugStatus = bugService.updateStatus
export const deleteBug = bugService.delete