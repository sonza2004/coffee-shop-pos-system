import prisma from '../config/prisma';

export interface CreateOrderItemInput {
  productId: string;
  qty: number;
}

export interface CreateOrderInput {
  userId: string;
  items: CreateOrderItemInput[];
}

// =====================
// ORDER SERVICE
// =====================
export class OrderService {
  static async createOrder(data: CreateOrderInput) {
    const productIds = data.items.map(i => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true }
    });

    if (products.length !== productIds.length) {
      throw new Error('Some products are invalid or inactive');
    }

    const productMap = new Map(products.map(p => [p.id, p]));

    let totalAmount = 0;

    const orderItems = data.items.map(item => {
      const product = productMap.get(item.productId)!;

      const price = product.price;
      const subtotal = price * item.qty;

      totalAmount += subtotal;

      return {
        productId: item.productId,
        qty: item.qty,
        price
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount,
        status: 'pending',
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });

    return order;
  }

  static async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true, paymentSlip: true }
    });
  }
}
