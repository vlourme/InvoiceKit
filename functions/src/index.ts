import * as admin from 'firebase-admin'

// Initialize app
admin.initializeApp()

// Export functions
export * from './distributedCounter/customers/onCreate'
export * from './distributedCounter/customers/onUpdate'
export * from './distributedCounter/customers/onDelete'
export * from './distributedCounter/customers/invoices/onCreate'
export * from './distributedCounter/customers/invoices/onUpdate'
export * from './distributedCounter/customers/invoices/onDelete'
