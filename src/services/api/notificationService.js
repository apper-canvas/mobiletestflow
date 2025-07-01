import notificationsData from '../mockData/notifications.json'

let notifications = [...notificationsData]

const notificationService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10) // Return only recent 10 notifications
  },

  markAsRead: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150))
    const index = notifications.findIndex(n => n.Id === id)
    if (index === -1) {
      throw new Error('Notification not found')
    }
    notifications[index] = {
      ...notifications[index],
      read: true
    }
    return { ...notifications[index] }
  },

  create: async (notificationData) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const maxId = Math.max(...notifications.map(n => n.Id), 0)
    const newNotification = {
      ...notificationData,
      Id: maxId + 1,
      read: false,
      createdAt: new Date().toISOString()
    }
    notifications.unshift(newNotification)
    return { ...newNotification }
  }
}

export const getNotifications = notificationService.getAll
export const markNotificationAsRead = notificationService.markAsRead
export const createNotification = notificationService.create