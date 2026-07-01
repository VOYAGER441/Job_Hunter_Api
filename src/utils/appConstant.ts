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
   PENDING = "pending",
   COMPLETED = "completed",
   FAILED = "failed",
   CANCELLED = "cancelled"
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
