import prisma from '../config/prisma';

export type AuditAction =
  | 'ORDER_CREATED'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_REJECTED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'STOCK_DEDUCTED';

export class AuditService {
  static async log(params: {
    action: AuditAction;
    userId?: string;
    refId?: string;
    meta?: any;
  }) {
    // NOTE: Prisma model not yet added in schema (to be added next)
    return prisma.$executeRawUnsafe(
      `INSERT INTO audit_logs (action, user_id, ref_id, meta, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      params.action,
      params.userId || null,
      params.refId || null,
      JSON.stringify(params.meta || {})
    );
  }
}
