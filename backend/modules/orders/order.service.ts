import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createOrderService(userId: string, items: { productId: string; qty: number }[]) {
  return prisma.$transaction(async (tx) => {
    const productIds = items.map(i => i.productId);

    const products = await tx.product.findMany({
      where: { id: { in: productIds } }
    });

    let totalAmount = 0;

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: 0,
        status: 'pending'
      }
    });

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);

      if (!product) {
        throw new Error('Product not found');
      }

      const linePrice = product.price * item.qty;
      totalAmount += linePrice;

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          qty: item.qty,
          price: product.price
        }
      });
    }

    return tx.order.update({
      where: { id: order.id },
      data: { totalAmount }
    });
  });
}

export async function getOrderByIdService(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      paymentSlip: true
    }
  });
}
