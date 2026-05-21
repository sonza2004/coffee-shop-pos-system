import prisma from '../config/prisma';

export async function approvePaymentService(paymentId: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.paymentSlip.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // ATOMIC GUARD: prevent double approval under concurrency
    const updatedPayment = await tx.paymentSlip.updateMany({
      where: {
        id: paymentId,
        status: 'pending'
      },
      data: {
        status: 'approved'
      }
    });

    if (updatedPayment.count === 0) {
      throw new Error('Payment already processed');
    }

    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: 'paid' }
    });

    const items = await tx.orderItem.findMany({
      where: { orderId: payment.orderId }
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQty: { decrement: item.qty } }
      });

      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          changeQty: -item.qty,
          type: 'sale',
          refOrderId: payment.orderId
        }
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrders = await tx.order.count({
      where: { status: 'paid' }
    });

    const totalSales = await tx.order.aggregate({
      where: { status: 'paid' },
      _sum: { totalAmount: true }
    });

    await tx.financialReport.upsert({
      where: { date: today },
      update: {
        totalOrders,
        totalSales: totalSales._sum.totalAmount || 0
      },
      create: {
        date: today,
        totalOrders,
        totalSales: totalSales._sum.totalAmount || 0,
        netRevenue: totalSales._sum.totalAmount || 0
      }
    });

    return { success: true, paymentId };
  });
}

export async function rejectPaymentService(paymentId: string) {
  return prisma.paymentSlip.update({
    where: { id: paymentId },
    data: { status: 'rejected' }
  });
}
