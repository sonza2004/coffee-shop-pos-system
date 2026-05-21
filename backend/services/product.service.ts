import prisma from '../config/prisma';
import { AuditService } from './audit.service';

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

  static async createProduct(data: { name: string; price: number; stockQty: number; userId?: string }) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        stockQty: data.stockQty
      }
    });

    await AuditService.log({
      action: 'PRODUCT_CREATED',
      userId: data.userId,
      refId: product.id,
      meta: data
    });

    return product;
  }

  static async updateProduct(
    id: string,
    data: Partial<{ name: string; price: number; stockQty: number; isActive: boolean }> & { userId?: string }
  ) {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        stockQty: data.stockQty,
        isActive: data.isActive
      }
    });

    await AuditService.log({
      action: 'PRODUCT_UPDATED',
      userId: data.userId,
      refId: id,
      meta: data
    });

    return product;
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
