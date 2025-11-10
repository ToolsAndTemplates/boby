import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bankofbaku.com' },
    update: {},
    create: {
      email: 'admin@bankofbaku.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log({ admin })

  // Read bank locations from JSON file
  const locationsPath = path.join(process.cwd(), 'locations', 'bank_locations.json')

  if (fs.existsSync(locationsPath)) {
    const locationsData = JSON.parse(fs.readFileSync(locationsPath, 'utf-8'))

    console.log(`Importing ${locationsData.length} locations...`)

    for (const location of locationsData) {
      if (location.latitude && location.longitude) {
        // Check if branch already exists
        const existingBranch = await prisma.branch.findFirst({
          where: {
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
          },
        })

        if (!existingBranch) {
          await prisma.branch.create({
            data: {
              name: location.name,
              address: location.address,
              type: location.type,
              services: location.services || 'All banking services',
              latitude: location.latitude,
              longitude: location.longitude,
            },
          })
        }
      }
    }
    console.log('Locations imported successfully')
  } else {
    console.log('No locations file found, skipping location import')

    // Create sample branch
    await prisma.branch.create({
      data: {
        name: 'Head Office ATM',
        address: 'Atatürk ave. 40/42, Bakı',
        type: 'ATM',
        services: 'All types of bank services',
        latitude: 40.410909,
        longitude: 49.848992,
      },
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
