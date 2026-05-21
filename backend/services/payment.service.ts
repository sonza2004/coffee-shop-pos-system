import prisma from '../config/prisma';
import { ProductService } from './product.service';
import { AuditService } from './audit.service';

export class PaymentService {
  static async uploadSlip(orderId: string, imageUrl: string) {
    return prisma.paymentSlip.create({
      data: {
        orderId,
        imageUrl,
        status: 'pending'
      }
    });
  }

  static async approvePayment(slipId: string) {
    return prisma.$transaction(async (tx) => {
      const slip = await tx.paymentSlip.findUnique({
        where: { id: slipId },
        include: { order: { include: { items: true } } }
      });

      if (!slip) throw new Error('Slip not found');

      if (slip.status !== 'pending') {
        throw new Error('Slip already processed');
      }

      await tx.paymentSlip.update({
        where: { id: slipId },
        data: { status: 'approved' }
      });

      await tx.order.update({
        where: { id: slip.orderId },
        data: { status: 'paid' }
      });

      for (const item of slip.order.items) {
        await ProductService.decreaseStock(item.productId, item.qty);

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            changeQty: -item.qty,
            type: 'sale',
            refOrderId: slip.orderId
          }
        });
      }

      // =====================
      // AUDIT LOG
      // =====================
      await AuditService.log({
        action: 'PAYMENT_APPROVED',
        refId: slipId,
        meta: {
          orderId: slip.orderId
        }
      });

      return { success: true, slipId };
    });
  }

  static async rejectPayment(slipId: string) {
    const slip = await prisma.paymentSlip.update({
      where: { id: slipId },
      data: { status: 'rejected' }
    });

    await AuditService.log({
      action: 'PAYMENT_REJECTED',
      refId: slipId
    });

    return slip;
  }
}
