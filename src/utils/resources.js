const STORAGE_KEY = 'apex_trading_resources'


const DEFAULT_RESOURCES = [
  {
    id: 'r1',
    name: 'Add a program or course you recommend',
    url: '#',
    description: 'Replace with a real link and a one-line description of why it is worth checking out.',
    dateAdded: null,
  },
  {
    id: 'r2',
    name: 'Add another resource',
    url: '#',
    description: 'Replace with a real link and a one-line description.',
    dateAdded: null,
  },
]

function persist(resources) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources))
  } catch {
   
  }
  return resources
}

export function getResources() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return persist(DEFAULT_RESOURCES)
    return JSON.parse(raw)
  } catch {
    return DEFAULT_RESOURCES
  }
}

export function addResource({ name, url }) {
  const resources = getResources()
  const newResource = {
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now()),
    name: name.trim(),
    url: url.trim(),
    description: '',
    dateAdded: new Date().toISOString(),
  }
  return persist([newResource, ...resources])
}

export function deleteResource(id) {
  const resources = getResources().filter((resource) => resource.id !== id)
  return persist(resources)
}
