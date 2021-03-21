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
