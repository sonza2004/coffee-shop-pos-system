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

    if (payment.status === 'approved') {
      throw new Error('Payment already approved');
    }

    const updatedPayment = await tx.paymentSlip.update({
      where: { id: paymentId },
      data: { status: 'approved' }
    });

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

    return updatedPayment;
  });
}

export async function rejectPaymentService(paymentId: string) {
  return prisma.paymentSlip.update({
    where: { id: paymentId },
    data: { status: 'rejected' }
  });
}
