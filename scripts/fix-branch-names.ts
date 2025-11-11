import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

// Decode HTML entities
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&laquo;': '«',
    '&raquo;': '»',
    '&ccedil;': 'ç',
    '&Ccedil;': 'Ç',
    '&nbsp;': ' ',
    '&ndash;': '–',
    '&mdash;': '—',
  }

  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entities[entity] || entity)
}

async function fixBranchNames() {
  console.log('Starting to fix branch names...')

  const branches = await prisma.branch.findMany()

  let updated = 0
  let skipped = 0

  for (const branch of branches) {
    const cleanName = decodeHTMLEntities(branch.name)
    const cleanAddress = decodeHTMLEntities(branch.address)

    if (cleanName !== branch.name || cleanAddress !== branch.address) {
      await prisma.branch.update({
        where: { id: branch.id },
        data: {
          name: cleanName,
          address: cleanAddress,
        },
      })
      console.log(`Updated: ${branch.name} -> ${cleanName}`)
      updated++
    } else {
      skipped++
    }
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`)
}

fixBranchNames()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
