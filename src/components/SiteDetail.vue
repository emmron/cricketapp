<script setup>
import { ref, computed } from 'vue'
import { sites, deleteSite, toast } from '../composables/useStore.js'

const props = defineProps({ siteId: Number })
const emit = defineEmits(['navigate'])

const site = computed(() => sites.value.find(s => s.id === props.siteId))

const activeTab = ref('deployments')
const expandedLog = ref(null)
const liveLogLines = ref([])
const isLiveDeploying = ref(false)
const liveLogId = ref(null)

const deployments = ref([
  { id: 1, commit: 'a3f9d12', message: 'fix: update hero section padding', status: 'success', branch: 'main', author: 'Alice', time: '2 min ago', duration: '45s', logs: [
    { time: '00:00', text: 'Cloning repository...' },
    { time: '00:02', text: 'Installing dependencies: npm install' },
    { time: '00:15', text: '✓ node_modules installed (327 packages)' },
    { time: '00:22', text: 'Running build: npm run build' },
    { time: '00:40', text: '✓ Build successful — dist: 1.2MB' },
    { time: '00:43', text: '✓ Deploying to CDN...' },
    { time: '00:45', text: '✓ Deploy complete! Live at https://portfolio.example.com' },
  ]},
  { id: 2, commit: 'b8e2c41', message: 'feat: add contact form with validation', status: 'success', branch: 'main', author: 'Alice', time: '3 hr ago', duration: '52s', logs: [] },
  { id: 3, commit: 'c1d7f89', message: 'chore: update all dependencies', status: 'failed', branch: 'main', author: 'Bob', time: '1 day ago', duration: '1m 12s', logs: [
    { time: '00:00', text: 'Cloning repository...' },
    { time: '00:04', text: 'Installing dependencies: npm install' },
    { time: '00:30', text: 'Running build: npm run build' },
    { time: '01:10', text: '✗ Build failed: Cannot find module \'vue-router\'' },
    { time: '01:11', text: '✗ Error: Module not found in package.json' },
    { time: '01:12', text: '✗ Deployment aborted.' },
  ]},
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

// ── Live deploy simulation ─────────────────────────────────────────────────
const DEPLOY_SCRIPT = [
  { delay: 0,    text: '▶ Starting deployment...' },
  { delay: 500,  text: 'Cloning repository from GitHub...' },
  { delay: 1200, text: '✓ Repository cloned' },
  { delay: 1600, text: 'Installing dependencies: npm install' },
  { delay: 3200, text: '✓ node_modules installed (327 packages)' },
  { delay: 3800, text: 'Running build command: npm run build' },
  { delay: 5500, text: '✓ Build successful — dist: 1.4MB' },
  { delay: 6100, text: 'Uploading assets to CDN...' },
  { delay: 7200, text: '✓ Assets uploaded (48 files)' },
  { delay: 7800, text: '✓ DNS updated' },
  { delay: 8200, text: `✓ Deploy complete! 🚀` },
]

function triggerDeploy() {
  if (isLiveDeploying.value) return
  isLiveDeploying.value = true
  liveLogLines.value = []
  liveLogId.value = 'live-' + Date.now()
  expandedLog.value = liveLogId.value

  // Update site status in store
  const s = sites.value.find(x => x.id === props.siteId)
  if (s) s.status = 'building'

  let timers = []
  DEPLOY_SCRIPT.forEach(({ delay, text }) => {
    timers.push(setTimeout(() => {
      const ts = String(Math.floor(delay / 1000)).padStart(2, '0') + ':' + String(delay % 1000 / 100 | 0).padStart(2, '0')
      liveLogLines.value.push({ time: ts, text })
    }, delay))
  })

  // Finish
  timers.push(setTimeout(() => {
    isLiveDeploying.value = false
    if (s) {
      s.status = 'live'
      s.lastDeploy = 'just now'
      s.buildTime = '8s'
    }
    // Add to deployments list
    deployments.value.unshift({
      id: Date.now(),
      commit: Math.random().toString(16).slice(2, 9),
      message: 'Manual deploy triggered',
      status: 'success',
      branch: s?.branch || 'main',
      author: 'Admin',
      time: 'just now',
      duration: '8s',
      logs: [...liveLogLines.value],
    })
    toast(`${s?.name || 'Site'} deployed successfully!`)
    liveLogId.value = null
  }, 8400))
}

function toggleLog(id) {
  expandedLog.value = expandedLog.value === id ? null : id
}

function addEnvVar() {
  if (newEnvKey.value.trim()) {
    envVars.value.push({ key: newEnvKey.value.trim(), value: newEnvVal.value.trim(), revealed: false })
    newEnvKey.value = ''
    newEnvVal.value = ''
    toast('Environment variable added', 'info')
  }
}

function removeEnvVar(i) {
  envVars.value.splice(i, 1)
  toast('Variable removed', 'info')
}

async function handleDelete() {
  const deleted = await deleteSite(props.siteId)
  if (deleted) emit('navigate', 'sites')
}
</script>

<template>
  <div class="page" v-if="site">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <button class="crumb-link" @click="emit('navigate', 'sites')">Sites</button>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M9 18l6-6-6-6" stroke-linecap="round"/></svg>
      <span class="crumb-current">{{ site.name }}</span>
    </div>

    <!-- Site Header -->
    <div class="site-header">
      <div class="site-title-wrap">
        <h1 class="site-name">{{ site.name }}</h1>
        <div class="site-status" :class="site.status">
          <span class="status-dot"></span>
          {{ site.status === 'live' ? 'Live' : site.status === 'building' ? 'Building…' : site.status === 'failed' ? 'Failed' : 'Stopped' }}
        </div>
      </div>
      <div class="site-url-bar">
        <span class="site-url">{{ site.url }}</span>
        <button class="btn btn-ghost btn-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-linecap="round"/></svg>
          Open
        </button>
      </div>
      <div class="site-meta-row">
        <span class="meta-pill">{{ site.repo }}</span>
        <span class="meta-pill">Branch: {{ site.branch }}</span>
        <span class="meta-pill">{{ site.framework }}</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in ['deployments','domains','env-vars','settings']" :key="tab"
        class="tab-btn" :class="{ active: activeTab === tab }"
        @click="activeTab = tab">
        {{ tab === 'env-vars' ? 'Env Vars' : tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- ── Deployments Tab ── -->
    <div v-if="activeTab === 'deployments'" class="tab-content">
      <div class="deploy-actions">
        <button class="btn btn-primary btn-sm" @click="triggerDeploy" :disabled="isLiveDeploying || site.status === 'building'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round"/></svg>
          {{ isLiveDeploying ? 'Deploying…' : 'Trigger Deploy' }}
        </button>
      </div>

      <!-- Live deploy log -->
      <div v-if="liveLogId" class="deploy-item">
        <div class="deploy-summary active-deploy" @click="toggleLog(liveLogId)">
          <div class="deploy-status-icon building">
            <span class="spinner"></span>
          </div>
          <div class="deploy-text">
            <div class="deploy-commit-msg">Deploying… <span class="live-badge">LIVE</span></div>
            <div class="deploy-commit-meta">
              <span class="mono">{{ site.branch }}</span>
              <span>by Admin</span>
            </div>
          </div>
          <svg class="expand-chevron" :class="{ open: expandedLog === liveLogId }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7" stroke-linecap="round"/></svg>
        </div>
        <div v-if="expandedLog === liveLogId" class="deploy-log">
          <div class="log-line" v-for="(line, i) in liveLogLines" :key="i">
            <span class="log-time">{{ line.time }}</span>
            <span class="log-text" :class="{ success: line.text.startsWith('✓'), error: line.text.startsWith('✗') }">{{ line.text }}</span>
          </div>
          <div v-if="isLiveDeploying" class="log-line">
            <span class="log-time">—</span>
            <span class="log-cursor">█</span>
          </div>
        </div>
      </div>

      <!-- Past deployments -->
      <div class="deployments-list">
        <div v-for="deploy in deployments" :key="deploy.id" class="deploy-item">
          <div class="deploy-summary" @click="toggleLog(deploy.id)">
            <div class="deploy-status-icon" :class="deploy.status">
              <svg v-if="deploy.status === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 13l4 4L19 7" stroke-linecap="round"/></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round"/></svg>
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
            <svg class="expand-chevron" :class="{ open: expandedLog === deploy.id }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7" stroke-linecap="round"/></svg>
          </div>
          <div v-if="expandedLog === deploy.id && deploy.logs.length" class="deploy-log">
            <div class="log-line" v-for="(line, i) in deploy.logs" :key="i">
              <span class="log-time">{{ line.time }}</span>
              <span class="log-text" :class="{ success: line.text.startsWith('✓'), error: line.text.startsWith('✗') }">{{ line.text }}</span>
            </div>
          </div>
          <div v-else-if="expandedLog === deploy.id" class="deploy-log empty-log">No log available.</div>
        </div>
      </div>
    </div>

    <!-- ── Domains Tab ── -->
    <div v-if="activeTab === 'domains'" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Custom Domains</h3>
          <button class="btn btn-primary btn-sm">Add Domain</button>
        </div>
        <div class="domain-list">
          <div v-for="d in domains" :key="d.host" class="domain-row">
            <div class="domain-host mono">{{ d.host }}</div>
            <span class="domain-type">{{ d.type }}</span>
            <span class="ssl-badge" v-if="d.ssl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round"/></svg>
              SSL Active
            </span>
            <button class="btn btn-danger-ghost btn-sm ml-auto" @click="domains.splice(domains.indexOf(d), 1); toast('Domain removed', 'info')">Remove</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Env Vars Tab ── -->
    <div v-if="activeTab === 'env-vars'" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Environment Variables</h3>
          <span class="env-count">{{ envVars.length }} variables</span>
        </div>
        <div class="env-list">
          <div v-for="(env, i) in envVars" :key="i" class="env-row">
            <input class="env-input mono" :value="env.key" readonly />
            <input class="env-input mono" :type="env.revealed ? 'text' : 'password'" :value="env.value" readonly />
            <button class="btn btn-ghost btn-sm" @click="env.revealed = !env.revealed">{{ env.revealed ? 'Hide' : 'Show' }}</button>
            <button class="btn btn-danger-ghost btn-sm" @click="removeEnvVar(i)">Remove</button>
          </div>
        </div>
        <div class="env-add">
          <input v-model="newEnvKey" class="env-input mono" placeholder="KEY" @keyup.enter="addEnvVar" />
          <input v-model="newEnvVal" class="env-input mono" placeholder="value" @keyup.enter="addEnvVar" />
          <button class="btn btn-primary btn-sm" @click="addEnvVar" :disabled="!newEnvKey.trim()">Add</button>
        </div>
      </div>
    </div>

    <!-- ── Settings Tab ── -->
    <div v-if="activeTab === 'settings'" class="tab-content">
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
          <button class="btn btn-primary" @click="toast('Build settings saved')">Save Settings</button>
        </div>
      </div>

      <div class="card danger-zone" style="margin-top: 1.5rem;">
        <div class="card-header"><h3 class="card-title" style="color: #ef4444;">Danger Zone</h3></div>
        <div class="settings-form">
          <div class="danger-action">
            <div>
              <div class="danger-action-title">Pause Deployments</div>
              <div class="danger-action-desc">Stop automatic deployments from git pushes</div>
            </div>
            <button class="btn btn-warning btn-sm" @click="toast('Deployments paused', 'info')">Pause</button>
          </div>
          <div class="danger-action">
            <div>
              <div class="danger-action-title">Delete Site</div>
              <div class="danger-action-desc">Permanently delete this site and all its deployments</div>
            </div>
            <button class="btn btn-danger btn-sm" @click="handleDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Site not found fallback -->
  <div class="page not-found" v-else>
    <p>Site not found.</p>
    <button class="btn btn-ghost" @click="emit('navigate', 'sites')">← Back to Sites</button>
  </div>
</template>

<style scoped>
.page { padding: 2rem; max-width: 960px; }

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-top: 4rem;
  color: var(--text-muted);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  color: var(--text-muted);
}

.crumb-link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  font-family: inherit;
}

.crumb-link:hover { text-decoration: underline; }

.site-header {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.site-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.625rem;
}

.site-name { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }

.site-status {
  font-size: 0.8rem;
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

.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.site-url-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.site-url { color: var(--accent); font-size: 0.9375rem; }

.site-meta-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.meta-pill {
  font-size: 0.75rem;
  padding: 3px 8px;
  background: var(--bg-hover);
  border-radius: 4px;
  color: var(--text-muted);
  font-family: monospace;
}

.tabs {
  display: flex;
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
  font-family: inherit;
}

.tab-btn:hover { color: var(--text-primary); }
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

.deploy-actions { margin-bottom: 1rem; }

.deployments-list { display: flex; flex-direction: column; gap: 0.5rem; }

.deploy-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.deploy-summary {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: background 0.1s;
}

.deploy-summary:hover { background: var(--bg-hover); }
.deploy-summary.active-deploy { border-left: 3px solid #f59e0b; }

.deploy-status-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.deploy-status-icon.success { background: rgba(34,197,94,0.15); color: #22c55e; }
.deploy-status-icon.failed { background: rgba(239,68,68,0.15); color: #ef4444; }
.deploy-status-icon.building { background: rgba(245,158,11,0.15); color: #f59e0b; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(245,158,11,0.3);
  border-top-color: #f59e0b;
  border-radius: 50%;
  display: block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.live-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  background: rgba(245,158,11,0.2);
  color: #f59e0b;
  border-radius: 3px;
  letter-spacing: 0.05em;
  vertical-align: middle;
  margin-left: 0.375rem;
}

.deploy-text { flex: 1; min-width: 0; }

.deploy-commit-msg {
  font-size: 0.875rem;
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
  padding: 1px 5px;
  border-radius: 4px;
  font-family: monospace;
}

.deploy-right-info { text-align: right; flex-shrink: 0; }
.deploy-dur { display: block; font-size: 0.8125rem; color: var(--text-primary); }
.deploy-ago { font-size: 0.75rem; color: var(--text-muted); }

.expand-chevron {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.expand-chevron.open { transform: rotate(180deg); }

.deploy-log {
  background: #080b10;
  border-top: 1px solid var(--border);
  padding: 0.875rem 1rem;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.empty-log { color: var(--text-muted); font-family: inherit; }

.log-line { display: flex; gap: 1rem; }
.log-time { color: #3a4a5a; flex-shrink: 0; min-width: 32px; }
.log-text { color: #b0c8e0; }
.log-text.success { color: #4ade80; }
.log-text.error { color: #f87171; }
.log-cursor { color: #6366f1; animation: blink 1s step-start infinite; }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

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

.env-count { font-size: 0.8125rem; color: var(--text-muted); }

.domain-list { padding: 0; }

.domain-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.domain-row:last-child { border-bottom: none; }

.domain-host { flex: 1; font-size: 0.875rem; color: var(--text-primary); }

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

.env-row { display: flex; gap: 0.5rem; align-items: center; }

.env-input {
  flex: 1;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.375rem 0.625rem;
  color: var(--text-primary);
  font-size: 0.8125rem;
  outline: none;
  font-family: monospace;
}

.env-input:focus { border-color: var(--accent); }

.env-add {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border);
  align-items: center;
}

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
  font-family: inherit;
}

.form-input:focus { border-color: var(--accent); }

.danger-zone { border-color: rgba(239,68,68,0.3); }

.danger-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--border);
}

.danger-action:last-child { border-bottom: none; }
.danger-action-title { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
.danger-action-desc { font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }
</style>
