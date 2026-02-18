<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ site: Object })
const emit = defineEmits(['navigate'])

const activeTab = ref('deployments')
const expandedLog = ref(null)

const deployments = ref([
  { id: 1, commit: 'a3f9d12', message: 'fix: update hero section padding', status: 'success', branch: 'main', author: 'Alice', time: '2 min ago', duration: '45s', logs: [
    { time: '00:00', text: 'Cloning repository...' },
    { time: '00:02', text: 'Installing dependencies: npm install' },
    { time: '00:15', text: 'Running build: npm run build' },
    { time: '00:40', text: '✓ Build successful (dist: 1.2MB)' },
    { time: '00:43', text: '✓ Deploying to CDN...' },
    { time: '00:45', text: '✓ Deploy complete! https://portfolio.example.com' },
  ]},
  { id: 2, commit: 'b8e2c41', message: 'feat: add contact form', status: 'success', branch: 'main', author: 'Alice', time: '3 hr ago', duration: '52s', logs: [] },
  { id: 3, commit: 'c1d7f89', message: 'chore: update dependencies', status: 'failed', branch: 'main', author: 'Bob', time: '1 day ago', duration: '1m 12s', logs: [
    { time: '00:00', text: 'Cloning repository...' },
    { time: '00:05', text: 'Installing dependencies: npm install' },
    { time: '00:30', text: 'Running build: npm run build' },
    { time: '01:10', text: '✗ Build failed: Cannot find module \'vue-router\'' },
    { time: '01:12', text: '✗ Deployment aborted.' },
  ]},
  { id: 4, commit: 'd4a2b56', message: 'style: responsive mobile nav', status: 'success', branch: 'main', author: 'Alice', time: '2 days ago', duration: '40s', logs: [] },
])

const envVars = ref([
  { key: 'API_BASE_URL', value: 'https://api.example.com', revealed: false },
  { key: 'STRIPE_KEY', value: 'sk_live_xxxxxxxxxxxx', revealed: false },
  { key: 'SENTRY_DSN', value: 'https://xxx@sentry.io/123', revealed: false },
])

const domains = ref([
  { host: 'portfolio.example.com', type: 'Primary', ssl: true },
  { host: 'www.portfolio.example.com', type: 'Redirect', ssl: true },
])

const newEnvKey = ref('')
const newEnvVal = ref('')

function addEnvVar() {
  if (newEnvKey.value.trim()) {
    envVars.value.push({ key: newEnvKey.value.trim(), value: newEnvVal.value.trim(), revealed: false })
    newEnvKey.value = ''
    newEnvVal.value = ''
  }
}

function removeEnvVar(i) { envVars.value.splice(i, 1) }

function toggleLog(id) {
  expandedLog.value = expandedLog.value === id ? null : id
}
</script>

<template>
  <div class="page">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <button class="crumb-link" @click="emit('navigate', 'sites')">Sites</button>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round"/></svg>
      <span class="crumb-current">{{ site?.name }}</span>
    </div>

    <!-- Site Header -->
    <div class="site-header">
      <div class="site-title-wrap">
        <h1 class="site-name">{{ site?.name }}</h1>
        <div class="site-status" :class="site?.status">
          <span class="status-dot"></span>
          {{ site?.status === 'live' ? 'Live' : site?.status === 'building' ? 'Building' : site?.status === 'failed' ? 'Failed' : 'Stopped' }}
        </div>
      </div>
      <div class="site-url-bar">
        <a class="site-url" href="#" @click.prevent>{{ site?.url }}</a>
        <button class="btn btn-ghost btn-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Open
        </button>
      </div>
      <div class="site-meta-row">
        <span class="meta-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ site?.repo }}
        </span>
        <span class="meta-pill">Branch: {{ site?.branch }}</span>
        <span class="meta-pill">Framework: {{ site?.framework }}</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in ['deployments', 'domains', 'env-vars', 'settings']" :key="tab"
        class="tab-btn" :class="{ active: activeTab === tab }"
        @click="activeTab = tab">
        {{ tab === 'env-vars' ? 'Env Vars' : tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- Deployments Tab -->
    <div v-if="activeTab === 'deployments'" class="tab-content">
      <div class="deploy-actions">
        <button class="btn btn-primary btn-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Trigger Deploy
        </button>
      </div>

      <div class="deployments-list">
        <div v-for="deploy in deployments" :key="deploy.id" class="deploy-item">
          <div class="deploy-summary" @click="toggleLog(deploy.id)">
            <div class="deploy-status-icon" :class="deploy.status">
              <svg v-if="deploy.status === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="deploy-text">
              <div class="deploy-commit-msg">{{ deploy.message }}</div>
              <div class="deploy-commit-meta">
                <span class="mono">{{ deploy.commit }}</span>
                <span>by {{ deploy.author }}</span>
                <span class="branch-chip">{{ deploy.branch }}</span>
              </div>
            </div>
            <div class="deploy-right-info">
              <span class="deploy-dur">{{ deploy.duration }}</span>
              <span class="deploy-ago">{{ deploy.time }}</span>
            </div>
            <svg class="expand-chevron" :class="{ open: expandedLog === deploy.id }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>

          <div v-if="expandedLog === deploy.id && deploy.logs.length" class="deploy-log">
            <div class="log-line" v-for="(line, i) in deploy.logs" :key="i">
              <span class="log-time">{{ line.time }}</span>
              <span class="log-text" :class="{ error: line.text.startsWith('✗'), success: line.text.startsWith('✓') }">{{ line.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Domains Tab -->
    <div v-if="activeTab === 'domains'" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Custom Domains</h3>
          <button class="btn btn-primary btn-sm">Add Domain</button>
        </div>
        <div class="domain-list">
          <div v-for="d in domains" :key="d.host" class="domain-row">
            <div class="domain-host">{{ d.host }}</div>
            <span class="domain-type">{{ d.type }}</span>
            <span class="ssl-badge" v-if="d.ssl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              SSL Active
            </span>
            <button class="btn btn-danger-ghost btn-sm ml-auto">Remove</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Env Vars Tab -->
    <div v-if="activeTab === 'env-vars'" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Environment Variables</h3>
        </div>
        <div class="env-list">
          <div v-for="(env, i) in envVars" :key="i" class="env-row">
            <input class="env-input mono" :value="env.key" readonly />
            <input class="env-input mono" :type="env.revealed ? 'text' : 'password'" :value="env.value" readonly />
            <button class="btn btn-ghost btn-sm" @click="env.revealed = !env.revealed">
              {{ env.revealed ? 'Hide' : 'Show' }}
            </button>
            <button class="btn btn-danger-ghost btn-sm" @click="removeEnvVar(i)">Remove</button>
          </div>
        </div>
        <div class="env-add">
          <input v-model="newEnvKey" class="env-input mono" placeholder="KEY" />
          <input v-model="newEnvVal" class="env-input mono" placeholder="value" />
          <button class="btn btn-primary btn-sm" @click="addEnvVar">Add</button>
        </div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'" class="tab-content">
      <div class="settings-grid">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Build Settings</h3></div>
          <div class="settings-form">
            <div class="form-group">
              <label class="form-label">Build Command</label>
              <input class="form-input mono" value="npm run build" />
            </div>
            <div class="form-group">
              <label class="form-label">Output Directory</label>
              <input class="form-input mono" value="dist" />
            </div>
            <div class="form-group">
              <label class="form-label">Install Command</label>
              <input class="form-input mono" value="npm install" />
            </div>
            <button class="btn btn-primary">Save Settings</button>
          </div>
        </div>

        <div class="card danger-zone">
          <div class="card-header"><h3 class="card-title danger-title">Danger Zone</h3></div>
          <div class="settings-form">
            <div class="danger-action">
              <div>
                <div class="danger-action-title">Pause Deployments</div>
                <div class="danger-action-desc">Stop automatic deployments from git pushes</div>
              </div>
              <button class="btn btn-warning btn-sm">Pause</button>
            </div>
            <div class="danger-action">
              <div>
                <div class="danger-action-title">Delete Site</div>
                <div class="danger-action-desc">Permanently delete this site and all deployments</div>
              </div>
              <button class="btn btn-danger btn-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 2rem; max-width: 1000px; }

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.crumb-link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
}

.crumb-link:hover { text-decoration: underline; }
.breadcrumb svg { width: 14px; height: 14px; color: var(--text-muted); }
.crumb-current { color: var(--text-muted); }

.site-header {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.site-title-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.site-name { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }

.site-status {
  font-size: 0.8125rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 3px 10px;
  border-radius: 20px;
}

.site-status.live { background: rgba(34,197,94,0.15); color: #22c55e; }
.site-status.failed { background: rgba(239,68,68,0.15); color: #ef4444; }
.site-status.building { background: rgba(245,158,11,0.15); color: #f59e0b; }
.site-status.stopped { background: var(--bg-hover); color: var(--text-muted); }

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.site-url-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.site-url { color: var(--accent); font-size: 0.9375rem; text-decoration: none; }
.site-url:hover { text-decoration: underline; }

.site-meta-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-pill {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  padding: 3px 8px;
  background: var(--bg-hover);
  border-radius: 4px;
  color: var(--text-muted);
}

.tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.625rem 1rem;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
}

.tab-btn:hover { color: var(--text-primary); }
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

.tab-content { }

.deploy-actions { margin-bottom: 1rem; }

.deployments-list { display: flex; flex-direction: column; gap: 0.5rem; }

.deploy-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.deploy-summary {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.1s;
}

.deploy-summary:hover { background: var(--bg-hover); }

.deploy-status-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.deploy-status-icon svg { width: 14px; height: 14px; }
.deploy-status-icon.success { background: rgba(34,197,94,0.15); color: #22c55e; }
.deploy-status-icon.failed { background: rgba(239,68,68,0.15); color: #ef4444; }

.deploy-text { flex: 1; min-width: 0; }

.deploy-commit-msg {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deploy-commit-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 3px;
  font-size: 0.75rem;
  color: var(--text-muted);
  align-items: center;
}

.mono { font-family: monospace; }

.branch-chip {
  background: var(--bg-hover);
  padding: 1px 6px;
  border-radius: 4px;
}

.deploy-right-info { text-align: right; flex-shrink: 0; }
.deploy-dur { display: block; font-size: 0.8125rem; color: var(--text-primary); }
.deploy-ago { font-size: 0.75rem; color: var(--text-muted); }

.expand-chevron {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.expand-chevron.open { transform: rotate(180deg); }

.deploy-log {
  background: #0d0d0d;
  border-top: 1px solid var(--border);
  padding: 1rem;
  font-family: monospace;
  font-size: 0.8125rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-line { display: flex; gap: 1rem; }
.log-time { color: #555; flex-shrink: 0; }
.log-text { color: #ccc; }
.log-text.success { color: #22c55e; }
.log-text.error { color: #ef4444; }

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.card-title { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); }

.domain-list { padding: 0.5rem 0; }

.domain-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
}

.domain-host { font-family: monospace; font-size: 0.9rem; color: var(--text-primary); flex: 1; }

.domain-type {
  font-size: 0.75rem;
  padding: 2px 8px;
  background: var(--bg-hover);
  border-radius: 4px;
  color: var(--text-muted);
}

.ssl-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #22c55e;
}

.ml-auto { margin-left: auto; }

.env-list { padding: 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }

.env-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.env-input {
  flex: 1;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.4rem 0.625rem;
  color: var(--text-primary);
  font-size: 0.8125rem;
  outline: none;
}

.env-input:focus { border-color: var(--accent); }

.env-add {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border);
  align-items: center;
}

.settings-grid { display: flex; flex-direction: column; gap: 1.5rem; }

.settings-form { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

.form-group { display: flex; flex-direction: column; gap: 0.375rem; }

.form-label { font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); }

.form-input {
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  width: 100%;
}

.form-input:focus { border-color: var(--accent); }

.danger-zone { border-color: rgba(239,68,68,0.3); }
.danger-title { color: #ef4444; }

.danger-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

.danger-action:last-child { border-bottom: none; padding-bottom: 0; }
.danger-action:first-child { padding-top: 0; }

.danger-action-title { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
.danger-action-desc { font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }
</style>
