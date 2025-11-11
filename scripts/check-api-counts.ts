interface BankAPIList {
  title: string
  address: string
  serviceNames: string
  location: string | null
  slug: string
  language: string
  id: string
}

interface BankAPIListGroup {
  id: string
  location: string | null
  lists: BankAPIList[]
}

interface BankAPIResponse {
  statusCode: number
  messages: string | null
  payload: {
    pages: Array<{
      informationGroup: Array<{
        listGroup: BankAPIListGroup[]
      }>
    }>
    positionOrder: number
    pageType: string
    siteMode: string
    categoryType: string
  }
}

async function checkAPICounts() {
  const response = await fetch(
    'https://site-api.bankofbaku.com/categories/serviceNetwork/individual',
    {
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://www.bankofbaku.com',
        'Referer': 'https://www.bankofbaku.com/',
      },
    }
  )

  const data: BankAPIResponse = await response.json()

  // Flatten and count by type
  const allLocations: Array<BankAPIList & { groupLocation: string }> = []
  for (const page of data.payload.pages) {
    if (!page.informationGroup) continue
    for (const infoGroup of page.informationGroup) {
      if (!infoGroup.listGroup) continue
      for (const listGroup of infoGroup.listGroup) {
        if (!listGroup.lists || !listGroup.location) continue
        for (const list of listGroup.lists) {
          allLocations.push({
            ...list,
            groupLocation: listGroup.location,
          })
        }
      }
    }
  }

  // Filter English only
  const englishLocations = allLocations.filter((loc) => loc.language === 'en')

  console.log('Total locations from API (English only):', englishLocations.length)

  // Count by type using same logic as sync API
  const typeCounts: Record<string, number> = {
    'Branches': 0,
    'ATMs': 0,
    'Payment Terminals': 0,
    'Service Points': 0,
  }

  for (const location of englishLocations) {
    const titleLower = (location.title || '').toLowerCase()

    let type = 'Branches'
    if (titleLower.includes('atm')) {
      type = 'ATMs'
    } else if (titleLower.includes('terminal')) {
      type = 'Payment Terminals'
    } else if (
      !titleLower.includes('branch') &&
      !titleLower.includes('filial') &&
      !titleLower.includes('office')
    ) {
      type = 'Service Points'
    }

    typeCounts[type]++
  }

  console.log('\nAPI counts by type:')
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`)
  })

  const total = Object.values(typeCounts).reduce((sum, count) => sum + count, 0)
  console.log(`  TOTAL: ${total}`)
}

checkAPICounts()
