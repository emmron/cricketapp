<script setup>
import { ref, computed } from 'vue'
import { sites, deleteSite, redeploySite, toggleSiteStatus, toast } from '../composables/useStore.js'
const emit = defineEmits(['navigate'])

const search = ref('')
const filterStatus = ref('all')
const openMenuId = ref(null)

const frameworkColors = {
  'Vue': '#42b883', 'React': '#61dafb', 'Next.js': '#eaeaea',
  'Nuxt': '#00dc82', 'Astro': '#ff5d01', 'Svelte': '#ff3e00',
  'Node.js': '#339933', 'HTML/CSS': '#e34c26',
}

const statusLabel = { live: 'Live', building: 'Building', failed: 'Failed', stopped: 'Stopped' }

const filteredSites = computed(() => {
  return sites.value.filter(s => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.url.toLowerCase().includes(q)
    const matchStatus = filterStatus.value === 'all' || s.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function openMenu(id, e) {
  e.stopPropagation()
  openMenuId.value = openMenuId.value === id ? null : id
}

function closeMenu() { openMenuId.value = null }

async function handleDelete(id) {
  closeMenu()
  const deleted = await deleteSite(id)
}

function handleRedeploy(id) {
  closeMenu()
  redeploySite(id)
}

function handleToggle(id) {
  closeMenu()
  toggleSiteStatus(id)
}

function copySiteUrl(url) {
  closeMenu()
  navigator.clipboard?.writeText('https://' + url).then(() => toast('URL copied to clipboard', 'info'))
}
</script>

<template>
  <div class="page" @click="closeMenu">
    <div class="page-header">
      <div>
        <h1 class="page-title">Sites</h1>
        <p class="page-subtitle">{{ sites.length }} site{{ sites.length !== 1 ? 's' : '' }} deployed</p>
      </div>
      <button class="btn btn-primary" @click="emit('navigate', 'new-site')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 4v16m8-8H4" stroke-linecap="round"/></svg>
        New Site
      </button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search sites…" class="search-input" />
        <button v-if="search" class="search-clear" @click="search = ''">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round"/></svg>
        </button>
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
        @click="emit('navigate', 'site-detail', site.id)"
      >
        <div class="site-card-header">
          <div class="framework-badge"
            :style="{ background: (frameworkColors[site.framework] || '#888') + '22', color: frameworkColors[site.framework] || '#888' }">
            {{ site.framework }}
          </div>
          <div class="card-right">
            <div class="site-status" :class="site.status">
              <span class="status-dot" :class="{ pulse: site.status === 'building' }"></span>
              {{ statusLabel[site.status] }}
            </div>
            <!-- Actions menu -->
            <div class="menu-wrap" @click.stop>
              <button class="menu-trigger" @click="openMenu(site.id, $event)" :class="{ active: openMenuId === site.id }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" stroke-linecap="round"/></svg>
              </button>
              <Transition name="dropdown">
                <div v-if="openMenuId === site.id" class="dropdown-menu">
                  <button class="dropdown-item" @click="handleRedeploy(site.id)" :disabled="site.status === 'building'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round"/></svg>
                    Redeploy
                  </button>
                  <button class="dropdown-item" @click="copySiteUrl(site.url)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round"/></svg>
                    Copy URL
                  </button>
                  <button class="dropdown-item" @click="handleToggle(site.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke-linecap="round"/></svg>
                    {{ site.status === 'stopped' ? 'Start' : 'Stop' }}
                  </button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item danger" @click="handleDelete(site.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round"/></svg>
                    Delete
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <div class="site-name">{{ site.name }}</div>
        <div class="site-url">{{ site.url }}</div>

        <div class="site-meta">
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke-linecap="round"/></svg>
            {{ site.branch }}
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round"/></svg>
            {{ site.lastDeploy }}
          </div>
        </div>

        <div class="site-repo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke-linecap="round"/></svg>
          {{ site.repo }}
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
        <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round"/>
      </svg>
      <p>No sites found</p>
      <button class="btn btn-ghost" @click="search = ''; filterStatus = 'all'">Clear filters</button>
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
  min-width: 180px;
  max-width: 300px;
}

.search-icon {
  position: absolute;
  left: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 2rem 0.5rem 2rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}

.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text-muted); }

.search-clear {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  padding: 2px;
}

.search-clear svg { width: 14px; height: 14px; }
.search-clear:hover { color: var(--text-primary); }

.filter-tabs {
  display: flex;
  gap: 3px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
}

.filter-tab {
  padding: 0.3rem 0.625rem;
  border-radius: 5px;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}

.filter-tab.active { background: var(--accent); color: white; }

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1rem;
}

.site-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.125rem;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.1s, box-shadow 0.15s;
  position: relative;
}

.site-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(99,102,241,0.12);
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
  padding: 2px 7px;
  border-radius: 20px;
}

.card-right { display: flex; align-items: center; gap: 0.5rem; }

.site-status {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.site-status.live { color: #22c55e; }
.site-status.building { color: #f59e0b; }
.site-status.failed { color: #ef4444; }
.site-status.stopped { color: var(--text-muted); }

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-dot.pulse { animation: pulse-dot 1.5s infinite; }

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

/* Dropdown menu */
.menu-wrap { position: relative; }

.menu-trigger {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 3px;
  border-radius: 4px;
  display: flex;
  transition: background 0.1s, color 0.1s;
}

.menu-trigger svg { width: 16px; height: 16px; }
.menu-trigger:hover, .menu-trigger.active { background: var(--bg-hover); color: var(--text-primary); }

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  z-index: 200;
  overflow: hidden;
  padding: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  background: none;
  border: none;
  border-radius: 5px;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
  font-family: inherit;
  text-align: left;
}

.dropdown-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.dropdown-item.danger { color: #ef4444; }
.dropdown-item.danger:hover { background: rgba(239,68,68,0.1); }
.dropdown-item:disabled { opacity: 0.5; cursor: not-allowed; }

.dropdown-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.dropdown-enter-active { transition: all 0.15s ease; }
.dropdown-leave-active { transition: all 0.1s ease; }
.dropdown-enter-from { opacity: 0; transform: translateY(-4px) scale(0.97); }
.dropdown-leave-to { opacity: 0; transform: translateY(-2px); }

.site-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
.site-url { font-size: 0.8125rem; color: var(--accent); margin-bottom: 0.875rem; }

.site-meta { display: flex; gap: 1rem; margin-bottom: 0.875rem; }

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
