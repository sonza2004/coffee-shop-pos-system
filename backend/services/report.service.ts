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
    }
  });

  const totalOrders = orders.length;

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const netRevenue = totalSales;

  return {
    date: today,
    totalOrders,
    totalSales,
    netRevenue
  };
}
