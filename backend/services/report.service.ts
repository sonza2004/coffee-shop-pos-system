import prisma from '../config/prisma';

export async function getDailyReportService() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      status: 'paid',
      createdAt: {
        gte: today
      }
    },
    include: {
      orderItems: true
    }
  });

  const totalOrders = orders.length;

  const totalSales = orders.reduce((sum, order) => {
    const orderTotal = order.orderItems.reduce((itemSum, item) => {
      return itemSum + (item.price * item.qty);
    }, 0);
    return sum + orderTotal;
  }, 0);

  const netRevenue = totalSales;

  return {
    date: today,
    totalOrders,
    totalSales,
    netRevenue
  };
}
