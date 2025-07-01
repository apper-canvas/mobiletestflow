const dashboardService = {
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      totalProjects: 8,
      totalTestCases: 156,
      activeBugs: 23,
      testExecutionRate: 87,
      testExecutionStatus: [
        { status: 'Passed', count: 98, percentage: 63 },
        { status: 'Failed', count: 34, percentage: 22 },
        { status: 'Pending', count: 24, percentage: 15 }
      ],
      recentActivity: [
        {
          type: 'test',
          message: 'Test case "User Registration Flow" marked as passed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'bug',
          message: 'Bug "Login button not responsive" reported',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'project',
          message: 'Project "Mobile Banking App" created',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'test',
          message: 'Test case "Payment Processing" failed',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'bug',
          message: 'Bug "Data validation error" resolved',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  }
}

export const getDashboardStats = dashboardService.getDashboardStats