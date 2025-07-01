const reportsService = {
  getReportsData: async (timeRange = '30d') => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      keyMetrics: [
        {
          title: 'Test Execution Rate',
          value: '87%',
          change: 5,
          icon: 'TrendingUp',
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Bug Detection Rate',
          value: '23',
          change: -12,
          icon: 'Bug',
          color: 'from-red-500 to-red-600'
        },
        {
          title: 'Test Coverage',
          value: '94%',
          change: 8,
          icon: 'Target',
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Avg Resolution Time',
          value: '2.4d',
          change: -15,
          icon: 'Clock',
          color: 'from-purple-500 to-purple-600'
        }
      ],
      bugDistribution: [
        { status: 'New', count: 8, percentage: 35 },
        { status: 'In Progress', count: 7, percentage: 30 },
        { status: 'Testing', count: 4, percentage: 17 },
        { status: 'Resolved', count: 3, percentage: 13 },
        { status: 'Closed', count: 1, percentage: 5 }
      ],
      teamPerformance: [
        {
          name: 'John Doe',
          testCasesCreated: 45,
          testCasesExecuted: 134,
          bugsFound: 23,
          bugsResolved: 18
        },
        {
          name: 'Jane Smith',
          testCasesCreated: 38,
          testCasesExecuted: 112,
          bugsFound: 19,
          bugsResolved: 15
        },
        {
          name: 'Mike Johnson',
          testCasesCreated: 52,
          testCasesExecuted: 98,
          bugsFound: 31,
          bugsResolved: 24
        },
        {
          name: 'Sarah Wilson',
          testCasesCreated: 29,
          testCasesExecuted: 87,
          bugsFound: 16,
          bugsResolved: 12
        }
      ],
      insights: [
        {
          type: 'success',
          title: 'Improved Test Coverage',
          description: 'Test coverage increased by 8% this month, indicating better quality assurance.'
        },
        {
          type: 'warning',
          title: 'High Bug Volume',
          description: 'Consider reviewing development practices as bug reports have increased by 15%.'
        },
        {
          type: 'info',
          title: 'Faster Resolution',
          description: 'Average bug resolution time has decreased to 2.4 days, showing improved efficiency.'
        },
        {
          type: 'success',
          title: 'Team Productivity',
          description: 'The team executed 134 test cases this month, exceeding the target by 12%.'
        }
      ]
    }
  }
}

export const getReportsData = reportsService.getReportsData