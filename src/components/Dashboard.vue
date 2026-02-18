<script setup>
import { ref } from 'vue'
const emit = defineEmits(['navigate'])

const stats = [
  { label: 'Total Sites', value: '12', change: '+2 this month', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', color: 'indigo' },
  { label: 'Deployments Today', value: '8', change: '3 successful, 1 failed', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: 'green' },
  { label: 'Bandwidth Used', value: '48 GB', change: '67% of limit', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'blue' },
  { label: 'Active Servers', value: '3', change: 'All healthy', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01', color: 'purple' },
]

const recentDeploys = ref([
  { id: 1, site: 'my-portfolio', branch: 'main', commit: 'a3f9d12', status: 'success', time: '2 min ago', duration: '45s' },
  { id: 2, site: 'shop-frontend', branch: 'feature/cart', commit: 'b8e2c41', status: 'building', time: '5 min ago', duration: '—' },
  { id: 3, site: 'api-docs', branch: 'main', commit: 'c1d7f89', status: 'success', time: '1 hr ago', duration: '32s' },
  { id: 4, site: 'blog-site', branch: 'main', commit: 'd4a2b56', status: 'failed', time: '3 hr ago', duration: '1m 12s' },
  { id: 5, site: 'landing-page', branch: 'redesign', commit: 'e6c3a78', status: 'success', time: '5 hr ago', duration: '28s' },
])

const quickActions = [
  { label: 'Import Git Repo', page: 'new-site', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
  { label: 'Add Database', page: 'databases', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
  { label: 'Add Server', page: 'servers', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
]
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Overview of your Coolify instance</p>
      </div>
      <button class="btn btn-primary" @click="emit('navigate', 'new-site')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4" stroke-linecap="round"/></svg>
        New Site
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card" :class="stat.color">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path :d="stat.icon" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-change">{{ stat.change }}</div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- Recent Deployments -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Recent Deployments</h2>
          <button class="btn btn-ghost btn-sm" @click="emit('navigate', 'sites')">View all</button>
        </div>
        <div class="deploy-list">
          <div v-for="deploy in recentDeploys" :key="deploy.id" class="deploy-row">
            <div class="deploy-status-dot" :class="deploy.status">
              <span v-if="deploy.status === 'building'" class="pulse-dot"></span>
            </div>
            <div class="deploy-info">
              <div class="deploy-site">{{ deploy.site }}</div>
              <div class="deploy-meta">
                <span class="branch-tag">{{ deploy.branch }}</span>
                <span class="commit-hash">{{ deploy.commit }}</span>
              </div>
            </div>
            <div class="deploy-right">
              <div class="deploy-duration">{{ deploy.duration }}</div>
              <div class="deploy-time">{{ deploy.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-col">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Quick Actions</h2>
          </div>
          <div class="actions-list">
            <button
              v-for="action in quickActions"
              :key="action.label"
              class="action-btn"
              @click="emit('navigate', action.page)"
            >
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path :d="action.icon" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>{{ action.label }}</span>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- System Status -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">System Status</h2>
            <span class="status-badge healthy">All systems operational</span>
          </div>
          <div class="status-list">
            <div class="status-row">
              <div class="status-dot green"></div>
              <span>API Gateway</span>
              <span class="status-val">Healthy</span>
            </div>
            <div class="status-row">
              <div class="status-dot green"></div>
              <span>Build Queue</span>
              <span class="status-val">3 running</span>
            </div>
            <div class="status-row">
              <div class="status-dot green"></div>
              <span>CDN</span>
              <span class="status-val">Operational</span>
            </div>
            <div class="status-row">
              <div class="status-dot yellow"></div>
              <span>Storage</span>
              <span class="status-val">67% used</span>
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

.stat-card.indigo .stat-icon { background: rgba(99,102,241,0.15); color: #6366f1; }
.stat-card.green .stat-icon { background: rgba(34,197,94,0.15); color: #22c55e; }
.stat-card.blue .stat-icon { background: rgba(59,130,246,0.15); color: #3b82f6; }
.stat-card.purple .stat-icon { background: rgba(168,85,247,0.15); color: #a855f7; }

.stat-icon svg { width: 22px; height: 22px; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.stat-label { font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }
.stat-change { font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.5rem;
}

.quick-actions-col { display: flex; flex-direction: column; gap: 1.5rem; }

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
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.card-title { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }

.deploy-list { padding: 0.5rem 0; }

.deploy-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  transition: background 0.1s;
}

.deploy-row:hover { background: var(--bg-hover); }

.deploy-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.deploy-status-dot.success { background: #22c55e; }
.deploy-status-dot.failed { background: #ef4444; }
.deploy-status-dot.building { background: #f59e0b; }

.pulse-dot {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: rgba(245,158,11,0.3);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0; }
}

.deploy-info { flex: 1; min-width: 0; }
.deploy-site { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
.deploy-meta { display: flex; gap: 0.5rem; margin-top: 2px; }

.branch-tag {
  font-size: 0.7rem;
  padding: 1px 6px;
  background: var(--bg-hover);
  border-radius: 4px;
  color: var(--text-muted);
  font-family: monospace;
}

.commit-hash {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: monospace;
}

.deploy-right { text-align: right; flex-shrink: 0; }
.deploy-duration { font-size: 0.8125rem; color: var(--text-primary); }
.deploy-time { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

.actions-list { padding: 0.5rem 0; }

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.1s;
}

.action-btn:hover { background: var(--bg-hover); }

.action-icon {
  width: 32px;
  height: 32px;
  background: var(--accent-subtle);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
}

.action-icon svg { width: 16px; height: 16px; }

.chevron { width: 16px; height: 16px; margin-left: auto; color: var(--text-muted); }

.status-badge {
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 20px;
}

.status-badge.healthy { background: rgba(34,197,94,0.15); color: #22c55e; }

.status-list { padding: 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }

.status-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.green { background: #22c55e; }
.status-dot.yellow { background: #f59e0b; }

.status-val { margin-left: auto; font-size: 0.8125rem; color: var(--text-muted); }

@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
}
</style>
