export interface User {
  _id: string
  email?: string
  facebookId?: string
  telegramId?: string
  vkId?: string
  feed?: boolean
  subscriptionStatus: string
  subscriptionId?: string
  customerId?: string
  token?: string
  nextInvoice?: any
}
