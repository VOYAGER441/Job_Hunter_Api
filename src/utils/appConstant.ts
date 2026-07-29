// ####################### server ########################
export enum NODE_ENVS {
   DEV = "dev",
   STG = "stg",
   PROD = "prod"
}


// ####################### user ########################
export enum USER_ROLE {
   ADMIN = "admin",
   USER = "user",
}



// ####################### auth ########################
export const enum authProvider {
   GOOGLE = "Google",
   FACEBOOK = "Facebook",
   LINKEDIN = "LinkedIn",
   APPLE = "Apple",
}

// ####################### subscription plan ########################
export enum USER_PLAN {
   FREE = "free",
   PRO = "pro",
   PRO_MAX = "pro_max"
}

export enum PLAN_CREDITS {
   FREE = 10,
   PRO = 100,
   PRO_MAX = 500
}
// ####################### order ########################

export enum ORDER_STATUS {
   CREATED = "created",
   PAID = "paid",
   FAILED = "failed",
   CANCELLED = "cancelled"
}

export enum PAYMENT_STATUS {
   PENDING = "pending",
   SUCCESS = "success",
   FAILED = "failed",
   REFUNDED = "refunded"
}

export enum INVOICE_STATUS {
   GENERATED = "generated",
   SENT = "sent",
   FAILED = "failed"
}

// ####################### job source ########################
export enum JOB_SOURCE {
  REMOTEOK   = "remoteok",
  THEMUSE    = "themuse",
  ARBEITNOW  = "arbeitnow",
  GRAPHQL_JOBS = "graphql_jobs",
  AI_DEV_JOBS  = "ai_dev_jobs",
  ADZUNA     = "adzuna",
  FINDWORK   = "findwork",
  USAJOBS    = "usajobs",
}
