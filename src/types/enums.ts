export const OrderStatus = {
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
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: 'pending',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  CARD_STRIPE: 'card_stripe',
  CARD_TABBY: 'card_tabby',
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PriceUnit = {
  PER_SERVICE: 'per_service',
  PER_HOUR: 'per_hour',
  PER_SQFT: 'per_sqft',
  PER_ROOM: 'per_room',
} as const;
export type PriceUnit = (typeof PriceUnit)[keyof typeof PriceUnit];

export const BuildingType = {
  TOWER: 'tower',
  LOW_RISE: 'low_rise',
  VILLA_COMPOUND: 'villa_compound',
  MIXED_USE: 'mixed_use',
} as const;
export type BuildingType = (typeof BuildingType)[keyof typeof BuildingType];

export const AreaPriority = {
  P0_LAUNCH: 'p0_launch',
  P1_MONTH2: 'p1_month2',
  P2_MONTH4: 'p2_month4',
} as const;
export type AreaPriority = (typeof AreaPriority)[keyof typeof AreaPriority];

export const ImageSource = {
  GOOGLE_PLACES: 'google_places',
  UNSPLASH: 'unsplash',
  MANUAL: 'manual',
  AREA_FALLBACK: 'area_fallback',
} as const;
export type ImageSource = (typeof ImageSource)[keyof typeof ImageSource];

export const AmcTier = {
  ESSENTIAL: 'essential',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  VIP: 'vip',
} as const;
export type AmcTier = (typeof AmcTier)[keyof typeof AmcTier];

export const UnitType = {
  STUDIO: 'studio',
  ONE_BR: '1br',
  TWO_BR: '2br',
  THREE_BR: '3br',
  FOUR_BR: '4br',
  FIVE_BR_PLUS: '5br_plus',
  VILLA_SMALL: 'villa_small',
  VILLA_MEDIUM: 'villa_medium',
  VILLA_LARGE: 'villa_large',
} as const;
export type UnitType = (typeof UnitType)[keyof typeof UnitType];

export const BillingCycle = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
} as const;
export type BillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle];

export const RuleType = {
  AREA_MULTIPLIER: 'area_multiplier',
  TIME_SURCHARGE: 'time_surcharge',
  SURGE: 'surge',
  SEASONAL: 'seasonal',
  BUILDING_TIER: 'building_tier',
} as const;
export type RuleType = (typeof RuleType)[keyof typeof RuleType];

export const ModifierType = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
} as const;
export type ModifierType = (typeof ModifierType)[keyof typeof ModifierType];

export const DiscountType = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_ADDON: 'free_addon',
  FREE_SERVICE: 'free_service',
} as const;
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

export const EmploymentType = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACTOR: 'contractor',
} as const;
export type EmploymentType = (typeof EmploymentType)[keyof typeof EmploymentType];

export const VehicleType = {
  CAR: 'car',
  VAN: 'van',
  MOTORCYCLE: 'motorcycle',
  NONE: 'none',
} as const;
export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

export const InvoiceStatus = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
  VOID: 'void',
} as const;
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const SubscriptionStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PENDING_RENEWAL: 'pending_renewal',
} as const;
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const WalletTransactionType = {
  CREDIT_REFERRAL: 'credit_referral',
  CREDIT_CASHBACK: 'credit_cashback',
  CREDIT_REFUND: 'credit_refund',
  CREDIT_MANUAL: 'credit_manual',
  DEBIT_PAYMENT: 'debit_payment',
  DEBIT_EXPIRY: 'debit_expiry',
} as const;
export type WalletTransactionType = (typeof WalletTransactionType)[keyof typeof WalletTransactionType];

export const OrderSource = {
  WEBSITE: 'website',
  WHATSAPP: 'whatsapp',
  PHONE: 'phone',
  ADMIN: 'admin',
  API: 'api',
} as const;
export type OrderSource = (typeof OrderSource)[keyof typeof OrderSource];

export const TranslationSource = {
  CLAUDE_API: 'claude_api',
  HUMAN_REVIEW: 'human_review',
  MANUAL: 'manual',
} as const;
export type TranslationSource = (typeof TranslationSource)[keyof typeof TranslationSource];
