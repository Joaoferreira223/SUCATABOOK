// Types definitions for JSDoc comments

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} material
 * @property {number} pricePerKilo
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} PurchaseItem
 * @property {string} productId
 * @property {string} productName
 * @property {string} material
 * @property {number} weight
 * @property {number} pricePerKilo
 * @property {number} itemValue
 */

/**
 * @typedef {Object} Purchase
 * @property {string} id
 * @property {PurchaseItem[]} items
 * @property {number} totalWeight
 * @property {number} totalValue
 * @property {number} totalPaid
 * @property {number} totalProfit
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} FinancialSummary
 * @property {number} totalPurchases
 * @property {number} totalRevenue
 * @property {number} totalProfit
 * @property {number} totalWeight
 * @property {number} averageProfit
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} role
 */

export {};