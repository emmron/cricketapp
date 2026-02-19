<script setup>
import { computed } from 'vue'
import { sites, databases, servers, redeploySite } from '../composables/useStore.js'
const emit = defineEmits(['navigate'])

const liveSites = computed(() => sites.value.filter(s => s.status === 'live').length)
const buildingSites = computed(() => sites.value.filter(s => s.status === 'building').length)
const failedSites = computed(() => sites.value.filter(s => s.status === 'failed').length)
const runningDbs = computed(() => databases.value.filter(d => d.status === 'running').length)
const healthyServers = computed(() => servers.value.filter(s => s.status === 'healthy').length)

const stats = computed(() => [
  { label: 'Total Sites', value: sites.value.length, sub: `${liveSites.value} live`, icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', color: 'indigo' },
  { label: 'Active Builds', value: buildingSites.value, sub: failedSites.value > 0 ? `${failedSites.value} failed` : 'All clear', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: buildingSites.value > 0 ? 'yellow' : 'green' },
  { label: 'Databases', value: databases.value.length, sub: `${runningDbs.value} running`, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4', color: 'blue' },
  { label: 'Servers', value: servers.value.length, sub: `${healthyServers.value} healthy`, icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01', color: 'purple' },
])

const recentSites = computed(() => [...sites.value].slice(0, 6))

const quickActions = [
  { label: 'Import Git Repo', page: 'new-site', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
  { label: 'Add Database', page: 'databases', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
  { label: 'View Servers', page: 'servers', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
]

const statusLabel = { live: 'Live', building: 'Building', failed: 'Failed', stopped: 'Stopped' }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Overview of your Coolify instance</p>
      </div>
      <button class="btn btn-primary" @click="emit('navigate', 'new-site')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M12 4v16m8-8H4" stroke-linecap="round"/></svg>
        New Site
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card" :class="s.color">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path :d="s.icon" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-sub">{{ s.sub }}</div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- Recent Sites -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Sites</h2>
          <button class="btn btn-ghost btn-sm" @click="emit('navigate', 'sites')">View all</button>
        </div>
        <div class="site-list" v-if="recentSites.length">
          <div
            v-for="site in recentSites"
            :key="site.id"
            class="site-row"
            @click="emit('navigate', 'site-detail', site.id)"
          >
            <div class="site-status-dot" :class="site.status">
              <span v-if="site.status === 'building'" class="spin-dot"></span>
            </div>
            <div class="site-info">
              <div class="site-name">{{ site.name }}</div>
              <div class="site-meta">
                <span class="tag">{{ site.branch }}</span>
                <span class="tag mono">{{ site.framework }}</span>
              </div>
            </div>
            <div class="site-right">
              <div class="site-deploy-time">{{ site.lastDeploy }}</div>
              <button class="redeploy-btn" @click.stop="redeploySite(site.id)" :disabled="site.status === 'building'" title="Redeploy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="card-empty" v-else>
          <p>No sites yet.</p>
          <button class="btn btn-primary btn-sm" @click="emit('navigate', 'new-site')">Deploy your first site</button>
        </div>
      </div>

      <!-- Right column -->
      <div class="right-col">
        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header"><h2 class="card-title">Quick Actions</h2></div>
          <div class="actions-list">
            <button v-for="action in quickActions" :key="action.label"
              class="action-btn" @click="emit('navigate', action.page)">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path :d="action.icon" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>{{ action.label }}</span>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <!-- System Status -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">System Status</h2>
            <span class="badge healthy">Operational</span>
          </div>
          <div class="status-list">
            <div class="status-row">
              <div class="dot green"></div>
              <span>API Gateway</span>
              <span class="status-val">Healthy</span>
            </div>
            <div class="status-row">
              <div class="dot" :class="buildingSites > 0 ? 'yellow' : 'green'"></div>
              <span>Build Queue</span>
              <span class="status-val">{{ buildingSites > 0 ? buildingSites + ' running' : 'Idle' }}</span>
            </div>
            <div class="status-row">
              <div class="dot green"></div>
              <span>CDN</span>
              <span class="status-val">Operational</span>
            </div>
            <div class="status-row">
              <div class="dot" :class="databases.filter(d => d.status === 'stopped').length > 0 ? 'yellow' : 'green'"></div>
              <span>Databases</span>
              <span class="status-val">{{ runningDbs }}/{{ databases.length }} running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 2rem; max-width: 1200px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.page-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: border-color 0.15s;
}

.stat-card:hover { border-color: var(--accent); }

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg { width: 22px; height: 22px; }

.stat-card.indigo .stat-icon { background: rgba(99,102,241,0.15); color: #6366f1; }
.stat-card.green .stat-icon { background: rgba(34,197,94,0.15); color: #22c55e; }
.stat-card.yellow .stat-icon { background: rgba(245,158,11,0.15); color: #f59e0b; }
.stat-card.blue .stat-icon { background: rgba(59,130,246,0.15); color: #3b82f6; }
.stat-card.purple .stat-icon { background: rgba(168,85,247,0.15); color: #a855f7; }

.stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); line-height: 1; }
.stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 3px; }
.stat-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
}

.right-col { display: flex; flex-direction: column; gap: 1.5rem; }

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.card-title { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }

.site-list { }

.site-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.1s;
}

.site-row:last-child { border-bottom: none; }
.site-row:hover { background: var(--bg-hover); }

.site-status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.site-status-dot.live { background: #22c55e; }
.site-status-dot.failed { background: #ef4444; }
.site-status-dot.building { background: #f59e0b; }
.site-status-dot.stopped { background: var(--text-muted); }

.spin-dot {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid #f59e0b;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.site-info { flex: 1; min-width: 0; }
.site-name { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
.site-meta { display: flex; gap: 0.375rem; margin-top: 2px; }

.tag {
  font-size: 0.7rem;
  padding: 1px 5px;
  background: var(--bg-hover);
  border-radius: 3px;
  color: var(--text-muted);
}

.mono { font-family: monospace; }

.site-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.site-deploy-time { font-size: 0.75rem; color: var(--text-muted); }

.redeploy-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  transition: background 0.1s, color 0.1s;
}

.redeploy-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
.redeploy-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.card-empty {
  padding: 2.5rem 1.25rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
}

.actions-list { }

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  transition: background 0.1s;
}

.action-btn:last-child { border-bottom: none; }
.action-btn:hover { background: var(--bg-hover); }

.action-icon {
  width: 30px;
  height: 30px;
  background: var(--accent-subtle);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
}

.action-icon svg { width: 15px; height: 15px; }

.chevron { width: 15px; height: 15px; margin-left: auto; color: var(--text-muted); }

.badge { font-size: 0.75rem; padding: 2px 8px; border-radius: 20px; }
.badge.healthy { background: rgba(34,197,94,0.15); color: #22c55e; }

.status-list { padding: 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 0.625rem; }

.status-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot.green { background: #22c55e; }
.dot.yellow { background: #f59e0b; }
.dot.red { background: #ef4444; }

.status-val { margin-left: auto; font-size: 0.8rem; color: var(--text-muted); }

@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
}
</style>
