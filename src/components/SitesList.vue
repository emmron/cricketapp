<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(['navigate'])

const search = ref('')
const filterStatus = ref('all')

const sites = ref([
  { id: 1, name: 'my-portfolio', url: 'portfolio.example.com', framework: 'Vue', status: 'live', lastDeploy: '2 min ago', branch: 'main', buildTime: '45s', repo: 'github.com/user/portfolio' },
  { id: 2, name: 'shop-frontend', url: 'shop.example.com', framework: 'React', status: 'building', lastDeploy: '5 min ago', branch: 'feature/cart', buildTime: '—', repo: 'github.com/user/shop' },
  { id: 3, name: 'api-docs', url: 'docs.example.com', framework: 'Next.js', status: 'live', lastDeploy: '1 hr ago', branch: 'main', buildTime: '32s', repo: 'github.com/user/api-docs' },
  { id: 4, name: 'blog-site', url: 'blog.example.com', framework: 'Nuxt', status: 'failed', lastDeploy: '3 hr ago', branch: 'main', buildTime: '1m 12s', repo: 'github.com/user/blog' },
  { id: 5, name: 'landing-page', url: 'landing.example.com', framework: 'Astro', status: 'live', lastDeploy: '5 hr ago', branch: 'redesign', buildTime: '28s', repo: 'github.com/user/landing' },
  { id: 6, name: 'admin-panel', url: 'admin.example.com', framework: 'Svelte', status: 'live', lastDeploy: '1 day ago', branch: 'main', buildTime: '55s', repo: 'github.com/user/admin' },
  { id: 7, name: 'mobile-api', url: 'api.example.com', framework: 'Node.js', status: 'live', lastDeploy: '2 days ago', branch: 'main', buildTime: '20s', repo: 'github.com/user/mobile-api' },
  { id: 8, name: 'static-site', url: 'static.example.com', framework: 'HTML/CSS', status: 'stopped', lastDeploy: '1 week ago', branch: 'main', buildTime: '10s', repo: 'github.com/user/static' },
])

const frameworkIcons = {
  'Vue': '#42b883',
  'React': '#61dafb',
  'Next.js': '#ffffff',
  'Nuxt': '#00dc82',
  'Astro': '#ff5d01',
  'Svelte': '#ff3e00',
  'Node.js': '#339933',
  'HTML/CSS': '#e34c26',
}

const filteredSites = computed(() => {
  return sites.value.filter(s => {
    const matchSearch = !search.value || s.name.toLowerCase().includes(search.value.toLowerCase()) || s.url.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = filterStatus.value === 'all' || s.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

const statusLabel = { live: 'Live', building: 'Building', failed: 'Failed', stopped: 'Stopped' }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Sites</h1>
        <p class="page-subtitle">{{ sites.length }} sites deployed</p>
      </div>
      <button class="btn btn-primary" @click="emit('navigate', 'new-site')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4" stroke-linecap="round"/></svg>
        New Site
      </button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search sites..." class="search-input" />
      </div>
      <div class="filter-tabs">
        <button v-for="f in ['all','live','building','failed','stopped']" :key="f"
          class="filter-tab" :class="{ active: filterStatus === f }"
          @click="filterStatus = f">
          {{ f === 'all' ? 'All' : statusLabel[f] }}
        </button>
      </div>
    </div>

    <!-- Sites Grid -->
    <div class="sites-grid" v-if="filteredSites.length">
      <div
        v-for="site in filteredSites"
        :key="site.id"
        class="site-card"
        @click="emit('navigate', 'site-detail', site)"
      >
        <div class="site-card-header">
          <div class="framework-badge" :style="{ background: frameworkIcons[site.framework] + '22', color: frameworkIcons[site.framework] }">
            {{ site.framework }}
          </div>
          <div class="site-status" :class="site.status">
            <span v-if="site.status === 'building'" class="pulse"></span>
            {{ statusLabel[site.status] }}
          </div>
        </div>

        <div class="site-name">{{ site.name }}</div>
        <div class="site-url">{{ site.url }}</div>

        <div class="site-meta">
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ site.branch }}
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ site.lastDeploy }}
          </div>
        </div>

        <div class="site-repo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ site.repo }}
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>No sites found</p>
      <button class="btn btn-primary" @click="search = ''; filterStatus = 'all'">Clear filters</button>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 2rem; max-width: 1200px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.page-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.page-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem; }

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s;
}

.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text-muted); }

.filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
}

.filter-tab {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-transform: capitalize;
}

.filter-tab.active {
  background: var(--accent);
  color: white;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.site-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.1s, box-shadow 0.15s;
}

.site-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(99,102,241,0.1);
}

.site-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.875rem;
}

.framework-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
}

.site-status {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.site-status.live { color: #22c55e; }
.site-status.building { color: #f59e0b; }
.site-status.failed { color: #ef4444; }
.site-status.stopped { color: var(--text-muted); }

.pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
  animation: pulse 1.5s infinite;
}

.site-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.site-url {
  font-size: 0.8125rem;
  color: var(--accent);
  margin-bottom: 1rem;
  text-decoration: none;
}

.site-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.875rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.meta-item svg { width: 14px; height: 14px; flex-shrink: 0; }

.site-repo {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  padding-top: 0.875rem;
  border-top: 1px solid var(--border);
  font-family: monospace;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
}

.empty-state p { margin-bottom: 1.5rem; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
