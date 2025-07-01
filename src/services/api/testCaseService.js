import testCasesData from '../mockData/testCases.json'

let testCases = [...testCasesData]

const testCaseService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...testCases]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150))
    const testCase = testCases.find(tc => tc.Id === id)
    if (!testCase) {
      throw new Error('Test case not found')
    }
    return { ...testCase }
  },

  create: async (testCaseData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxId = Math.max(...testCases.map(tc => tc.Id), 0)
    const newTestCase = {
      ...testCaseData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    testCases.unshift(newTestCase)
    return { ...newTestCase }
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = testCases.findIndex(tc => tc.Id === id)
    if (index === -1) {
      throw new Error('Test case not found')
    }
    testCases[index] = {
      ...testCases[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...testCases[index] }
  },

  updateStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = testCases.findIndex(tc => tc.Id === id)
    if (index === -1) {
      throw new Error('Test case not found')
    }
    testCases[index] = {
      ...testCases[index],
      status,
      updatedAt: new Date().toISOString()
    }
    return { ...testCases[index] }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = testCases.findIndex(tc => tc.Id === id)
    if (index === -1) {
      throw new Error('Test case not found')
    }
    testCases.splice(index, 1)
    return true
  }
}

export const getTestCases = testCaseService.getAll
export const getTestCaseById = testCaseService.getById
export const createTestCase = testCaseService.create
export const updateTestCase = testCaseService.update
export const updateTestCaseStatus = testCaseService.updateStatus
export const deleteTestCase = testCaseService.delete