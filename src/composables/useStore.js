import { ref, watch } from 'vue'

// ─── Persistence helper ───────────────────────────────────────────────────────
function persist(key, initial) {
  let stored
  try { stored = JSON.parse(localStorage.getItem(key)) } catch {}
  const val = ref(stored ?? initial)
  watch(val, v => localStorage.setItem(key, JSON.stringify(v)), { deep: true })
  return val
}

// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_SITES = [
  { id: 1, name: 'my-portfolio', url: 'portfolio.example.com', framework: 'Vue', status: 'live', lastDeploy: '2 min ago', branch: 'main', buildTime: '45s', repo: 'github.com/user/portfolio' },
  { id: 2, name: 'shop-frontend', url: 'shop.example.com', framework: 'React', status: 'building', lastDeploy: '5 min ago', branch: 'feature/cart', buildTime: '—', repo: 'github.com/user/shop' },
  { id: 3, name: 'api-docs', url: 'docs.example.com', framework: 'Next.js', status: 'live', lastDeploy: '1 hr ago', branch: 'main', buildTime: '32s', repo: 'github.com/user/api-docs' },
  { id: 4, name: 'blog-site', url: 'blog.example.com', framework: 'Nuxt', status: 'failed', lastDeploy: '3 hr ago', branch: 'main', buildTime: '1m 12s', repo: 'github.com/user/blog' },
  { id: 5, name: 'landing-page', url: 'landing.example.com', framework: 'Astro', status: 'live', lastDeploy: '5 hr ago', branch: 'redesign', buildTime: '28s', repo: 'github.com/user/landing' },
  { id: 6, name: 'admin-panel', url: 'admin.example.com', framework: 'Svelte', status: 'live', lastDeploy: '1 day ago', branch: 'main', buildTime: '55s', repo: 'github.com/user/admin' },
]

const DEFAULT_DATABASES = [
  { id: 1, name: 'prod-postgres', type: 'PostgreSQL', version: '16', status: 'running', size: '2.4 GB', connections: 12, host: 'db.internal:5432' },
  { id: 2, name: 'cache-redis', type: 'Redis', version: '7', status: 'running', size: '128 MB', connections: 34, host: 'redis.internal:6379' },
  { id: 3, name: 'analytics-mongo', type: 'MongoDB', version: '7', status: 'stopped', size: '8.1 GB', connections: 0, host: 'mongo.internal:27017' },
]

const DEFAULT_SERVERS = [
  { id: 1, name: 'prod-us-east', ip: '10.0.1.10', os: 'Ubuntu 22.04', cpu: 45, memory: 62, disk: 38, status: 'healthy', sites: 8, region: 'US East' },
  { id: 2, name: 'prod-eu-west', ip: '10.0.2.10', os: 'Ubuntu 22.04', cpu: 23, memory: 41, disk: 55, status: 'healthy', sites: 4, region: 'EU West' },
  { id: 3, name: 'staging', ip: '10.0.3.10', os: 'Debian 12', cpu: 12, memory: 28, disk: 20, status: 'healthy', sites: 3, region: 'US West' },
]

// ─── Reactive state ───────────────────────────────────────────────────────────
export const sites = persist('cf_sites', DEFAULT_SITES)
export const databases = persist('cf_dbs', DEFAULT_DATABASES)
export const servers = persist('cf_servers', DEFAULT_SERVERS)
export const theme = persist('cf_theme', 'dark')

// ─── Toast notifications ──────────────────────────────────────────────────────
export const toasts = ref([])
let _tid = 0

export function toast(message, type = 'success', duration = 3500) {
  const id = ++_tid
  toasts.value.push({ id, message, type })
  setTimeout(() => dismiss(id), duration)
}

export function dismiss(id) {
  const i = toasts.value.findIndex(t => t.id === id)
  if (i !== -1) toasts.value.splice(i, 1)
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────
export const confirmState = ref({ open: false, title: '', message: '', resolve: null })

export function confirm(title, message) {
  return new Promise(resolve => {
    confirmState.value = { open: true, title, message, resolve }
  })
}

export function resolveConfirm(result) {
  confirmState.value.open = false
  confirmState.value.resolve?.(result)
}

// ─── Site operations ──────────────────────────────────────────────────────────
let _sid = Math.max(0, ...DEFAULT_SITES.map(s => s.id))

export function addSite(site) {
  sites.value.unshift({ ...site, id: ++_sid, status: 'live', lastDeploy: 'just now' })
  toast(`🚀 ${site.name} deployed successfully!`)
}

export async function deleteSite(id) {
  const site = sites.value.find(s => s.id === id)
  const ok = await confirm('Delete site', `Are you sure you want to delete "${site?.name}"? This action cannot be undone.`)
  if (!ok) return false
  sites.value = sites.value.filter(s => s.id !== id)
  toast(`${site?.name} deleted`, 'info')
  return true
}

export function redeploySite(id) {
  const site = sites.value.find(s => s.id === id)
  if (!site) return
  site.status = 'building'
  site.lastDeploy = 'just now'
  toast(`Deploying ${site.name}…`, 'info')
  setTimeout(() => {
    site.status = 'live'
    site.buildTime = Math.round(25 + Math.random() * 40) + 's'
    toast(`${site.name} deployed successfully!`)
  }, 6000)
}

export function toggleSiteStatus(id) {
  const site = sites.value.find(s => s.id === id)
  if (!site) return
  site.status = site.status === 'stopped' ? 'live' : 'stopped'
  toast(`${site.name} ${site.status === 'live' ? 'started' : 'stopped'}`, 'info')
}

// ─── Database operations ──────────────────────────────────────────────────────
let _dbid = Math.max(0, ...DEFAULT_DATABASES.map(d => d.id))

export function addDatabase(db) {
  databases.value.push({ ...db, id: ++_dbid, status: 'running', connections: 0 })
  toast(`${db.name} created successfully`)
}

export async function deleteDatabase(id) {
  const db = databases.value.find(d => d.id === id)
  const ok = await confirm('Delete database', `Are you sure you want to delete "${db?.name}"? All data will be lost.`)
  if (!ok) return
  databases.value = databases.value.filter(d => d.id !== id)
  toast(`${db?.name} deleted`, 'info')
}

export function toggleDbStatus(id) {
  const db = databases.value.find(d => d.id === id)
  if (!db) return
  db.status = db.status === 'running' ? 'stopped' : 'running'
  db.connections = db.status === 'running' ? Math.floor(Math.random() * 20) : 0
  toast(`${db.name} ${db.status}`, 'info')
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
}

export function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  applyTheme(theme.value)
}
