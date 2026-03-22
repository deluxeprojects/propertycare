export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ADMIN_ROLES: Role[] = ['super_admin', 'admin', 'manager', 'operator'];

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

export const PAYMENT_METHODS = {
  CARD_STRIPE: 'card_stripe',
  CARD_TABBY: 'card_tabby',
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export const TIME_SLOTS = [
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
  '20:00-22:00',
] as const;

export const PROPERTY_SIZES = [
  'Studio',
  '1BR',
  '2BR',
  '3BR',
  '4BR',
  '5BR+',
  'Villa',
] as const;

export type PropertySize = (typeof PROPERTY_SIZES)[number];

export const AMC_TIERS = {
  ESSENTIAL: 'essential',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  VIP: 'vip',
} as const;

export type AmcTier = (typeof AMC_TIERS)[keyof typeof AMC_TIERS];

export const LANGUAGES = ['en', 'ar', 'ru', 'zh', 'de'] as const;
export type Language = (typeof LANGUAGES)[number];

export const RTL_LANGUAGES: Language[] = ['ar'];

export const VAT_RATE = 0.05;
export const MIN_ADVANCE_HOURS = 4;
export const MAX_ADVANCE_DAYS = 30;
export const CANCELLATION_HOURS = 12;
export const CANCELLATION_FEE_PCT = 25;
export const MAX_RESCHEDULES = 2;
