import prisma from '../config/prisma';

export class ReportService {
  static async getDailyReport(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        status: 'paid',
        createdAt: {
          gte: start,
          lte: end
        }
      }
    });

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      date: start.toISOString().split('T')[0],
      totalOrders,
      totalSales,
      netRevenue: totalSales
    };
  }
}
