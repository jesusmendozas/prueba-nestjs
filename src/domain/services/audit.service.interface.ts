export enum AuditEventType {
  USER_REGISTERED = 'user_registered',
  USER_LOGIN = 'user_login',
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
  ERROR_OCCURRED = 'error_occurred',
}

export interface AuditLog {
  eventType: AuditEventType;
  userId?: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface IAuditService {
  log(log: AuditLog): Promise<void>;
  getUserLogs(userId: number): Promise<AuditLog[]>;
}

export const IAuditService = Symbol('IAuditService');

