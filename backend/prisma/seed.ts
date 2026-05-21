import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const adminHash    = await bcrypt.hash('admin123', 10)
  const cashierHash  = await bcrypt.hash('cashier123', 10)
  const ownerHash    = await bcrypt.hash('owner123', 10)

  await prisma.user.upsert({
    where:  { email: 'admin@cafe.com' },
    update: {},
    create: { email: 'admin@cafe.com', passwordHash: adminHash, name: 'Admin', role: 'admin' },
  })
  await prisma.user.upsert({
    where:  { email: 'cashier@cafe.com' },
    update: {},
    create: { email: 'cashier@cafe.com', passwordHash: cashierHash, name: 'Cashier', role: 'cashier' },
  })
  await prisma.user.upsert({
    where:  { email: 'owner@cafe.com' },
    update: {},
    create: { email: 'owner@cafe.com', passwordHash: ownerHash, name: 'Owner', role: 'owner' },
  })

  const products = [
    { name: 'Espresso',         price: 50,  stock: 100 },
    { name: 'Latte',            price: 70,  stock: 100 },
    { name: 'Cappuccino',       price: 80,  stock: 100 },
    { name: 'Americano',        price: 60,  stock: 100 },
    { name: 'Mocha',            price: 85,  stock: 100 },
    { name: 'Croissant',        price: 45,  stock:  50 },
    { name: 'Blueberry Muffin', price: 55,  stock:  50 },
    { name: 'Cheese Cake',      price: 90,  stock:  30 },
  ]

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } })
    if (!existing) {
      await prisma.product.create({ data: { ...p, isActive: true } })
    }
  }

  console.log('✅ Seed complete')
  console.log('   admin@cafe.com    / admin123')
  console.log('   cashier@cafe.com  / cashier123')
  console.log('   owner@cafe.com    / owner123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
