<script setup>
import { ref } from 'vue'

const servers = ref([
  { id: 1, name: 'prod-us-east', ip: '10.0.1.10', os: 'Ubuntu 22.04', cpu: 45, memory: 62, disk: 38, status: 'healthy', sites: 8, region: 'US East' },
  { id: 2, name: 'prod-eu-west', ip: '10.0.2.10', os: 'Ubuntu 22.04', cpu: 23, memory: 41, disk: 55, status: 'healthy', sites: 4, region: 'EU West' },
  { id: 3, name: 'staging', ip: '10.0.3.10', os: 'Debian 12', cpu: 12, memory: 28, disk: 20, status: 'healthy', sites: 3, region: 'US West' },
])

function barColor(val) {
  if (val >= 80) return '#ef4444'
  if (val >= 60) return '#f59e0b'
  return '#22c55e'
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Servers</h1>
        <p class="page-subtitle">{{ servers.length }} servers connected</p>
      </div>
      <button class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4" stroke-linecap="round"/></svg>
        Add Server
      </button>
    </div>

    <div class="servers-list">
      <div v-for="srv in servers" :key="srv.id" class="server-card">
        <div class="server-card-header">
          <div class="server-name-wrap">
            <div class="server-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <div class="server-name">{{ srv.name }}</div>
              <div class="server-ip mono">{{ srv.ip }} · {{ srv.os }}</div>
            </div>
          </div>
          <div class="server-badges">
            <span class="region-badge">{{ srv.region }}</span>
            <span class="status-badge" :class="srv.status">
              <span class="status-dot"></span>
              {{ srv.status === 'healthy' ? 'Healthy' : 'Warning' }}
            </span>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric">
            <div class="metric-header">
              <span class="metric-label">CPU</span>
              <span class="metric-val" :style="{ color: barColor(srv.cpu) }">{{ srv.cpu }}%</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" :style="{ width: srv.cpu + '%', background: barColor(srv.cpu) }"></div>
            </div>
          </div>
          <div class="metric">
            <div class="metric-header">
              <span class="metric-label">Memory</span>
              <span class="metric-val" :style="{ color: barColor(srv.memory) }">{{ srv.memory }}%</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" :style="{ width: srv.memory + '%', background: barColor(srv.memory) }"></div>
            </div>
          </div>
          <div class="metric">
            <div class="metric-header">
              <span class="metric-label">Disk</span>
              <span class="metric-val" :style="{ color: barColor(srv.disk) }">{{ srv.disk }}%</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" :style="{ width: srv.disk + '%', background: barColor(srv.disk) }"></div>
            </div>
          </div>
        </div>

        <div class="server-footer">
          <span class="sites-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ srv.sites }} sites
          </span>
          <div class="server-actions">
            <button class="btn btn-ghost btn-sm">SSH</button>
            <button class="btn btn-ghost btn-sm">Logs</button>
            <button class="btn btn-ghost btn-sm">Settings</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 2rem; max-width: 1000px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.page-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.page-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem; }

.servers-list { display: flex; flex-direction: column; gap: 1rem; }

.server-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.server-card-header { display: flex; justify-content: space-between; align-items: flex-start; }

.server-name-wrap { display: flex; align-items: center; gap: 0.875rem; }

.server-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--accent-subtle);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.server-icon svg { width: 22px; height: 22px; }

.server-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); }
.server-ip { font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }
.mono { font-family: monospace; }

.server-badges { display: flex; gap: 0.5rem; align-items: center; }

.region-badge {
  font-size: 0.75rem;
  padding: 3px 8px;
  background: var(--bg-hover);
  border-radius: 4px;
  color: var(--text-muted);
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-badge.healthy { color: #22c55e; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

.metric { display: flex; flex-direction: column; gap: 0.375rem; }

.metric-header { display: flex; justify-content: space-between; align-items: center; }
.metric-label { font-size: 0.8125rem; color: var(--text-muted); }
.metric-val { font-size: 0.8125rem; font-weight: 600; }

.metric-bar {
  height: 6px;
  background: var(--bg-hover);
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.server-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.sites-count {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.server-actions { display: flex; gap: 0.5rem; }
</style>
