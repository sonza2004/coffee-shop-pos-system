import prisma from '../../config/prisma';

export async function getProductsService() {
  return prisma.product.findMany({
    where: { isActive: true }
  });
}

export async function createProductService(data: {
  name: string;
  price: number;
  stockQty: number;
}) {
  return prisma.product.create({
    data
  });
}

export async function updateProductService(
  id: string,
  data: Partial<{ name: string; price: number; stockQty: number; isActive: boolean }>
) {
  return prisma.product.update({
    where: { id },
    data
  });
}
