import * as admin from 'firebase-admin'

// Initialize app
admin.initializeApp()

// Export functions
export * from './customers/onCreate'
export * from './customers/onUpdate'
export * from './customers/onDelete'
export * from './customers/invoices/onCreate'
export * from './customers/invoices/onUpdate'
export * from './customers/invoices/onDelete'
export * from './customers/contracts/onCreate'
export * from './customers/contracts/onUpdate'
export * from './customers/contracts/onDelete'
export * from './teams/getAlgoliaKey'
export * from './teams/leave'
export * from './teams/delete'
export * from './teams/invite'
export * from './teams/acceptInvite'
export * from './pubsub/teamCharts'
