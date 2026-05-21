import prisma from '../config/prisma';

export class ProductService {
  static async getAllProducts() {
    return prisma.product.findMany({
      where: { isActive: true }
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id }
    });
  }

  static async createProduct(data: { name: string; price: number; stockQty: number }) {
    return prisma.product.create({
      data
    });
  }

  static async updateProduct(id: string, data: Partial<{ name: string; price: number; stockQty: number; isActive: boolean }>) {
    return prisma.product.update({
      where: { id },
      data
    });
  }

  static async decreaseStock(productId: string, qty: number) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        stockQty: {
          decrement: qty
        }
      }
    });
  }
}
