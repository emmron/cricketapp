<script setup>
import { ref } from 'vue'
const emit = defineEmits(['navigate'])

const step = ref(1)
const selectedProvider = ref(null)
const repoUrl = ref('')
const selectedRepo = ref(null)
const framework = ref('auto')
const buildCmd = ref('npm run build')
const outputDir = ref('dist')
const installCmd = ref('npm install')
const siteName = ref('')
const deploying = ref(false)
const deployDone = ref(false)
const deployProgress = ref(0)

const providers = [
  { id: 'github', label: 'GitHub', color: '#fff' },
  { id: 'gitlab', label: 'GitLab', color: '#fc6d26' },
  { id: 'bitbucket', label: 'Bitbucket', color: '#0052cc' },
  { id: 'url', label: 'Public URL', color: '#6366f1' },
]

const mockRepos = [
  'user/my-portfolio',
  'user/shop-frontend',
  'user/api-docs',
  'user/blog-nuxt',
  'user/landing-page',
]

const frameworks = ['Auto Detect', 'Vue', 'React', 'Next.js', 'Nuxt', 'Astro', 'Svelte', 'HTML/CSS', 'Node.js', 'Other']

function selectProvider(p) {
  selectedProvider.value = p
  if (p !== 'url') step.value = 2
}

function selectRepo(r) {
  selectedRepo.value = r
  siteName.value = r.split('/')[1]
  step.value = 3
}

async function deploy() {
  deploying.value = true
  deployProgress.value = 0
  const interval = setInterval(() => {
    deployProgress.value += Math.random() * 15
    if (deployProgress.value >= 100) {
      deployProgress.value = 100
      clearInterval(interval)
      deploying.value = false
      deployDone.value = true
    }
  }, 400)
}

function goBack() {
  if (step.value > 1) step.value--
  else emit('navigate', 'sites')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back
      </button>
      <h1 class="page-title">Add New Site</h1>
    </div>

    <!-- Step Indicator -->
    <div class="steps">
      <div v-for="s in 3" :key="s" class="step" :class="{ active: step === s, done: step > s }">
        <div class="step-num">
          <svg v-if="step > s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span v-else>{{ s }}</span>
        </div>
        <span class="step-label">{{ ['Connect Git', 'Pick Repo', 'Configure'][s-1] }}</span>
      </div>
    </div>

    <!-- Step 1: Provider -->
    <div v-if="step === 1" class="step-content">
      <h2 class="step-title">Connect to a Git Provider</h2>
      <p class="step-desc">Choose where your code is hosted to automatically deploy on every push.</p>
      <div class="provider-grid">
        <button
          v-for="p in providers"
          :key="p.id"
          class="provider-card"
          :class="{ selected: selectedProvider === p.id }"
          @click="selectProvider(p.id)"
        >
          <div class="provider-icon" :style="{ background: p.color + '22', color: p.color }">
            <svg v-if="p.id === 'github'" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
            <svg v-else-if="p.id === 'url'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-else class="provider-initial">{{ p.label[0] }}</span>
          </div>
          <span class="provider-label">{{ p.label }}</span>
        </button>
      </div>

      <div v-if="selectedProvider === 'url'" class="url-input-wrap">
        <input v-model="repoUrl" class="form-input" placeholder="https://github.com/user/repo" />
        <button class="btn btn-primary" :disabled="!repoUrl" @click="step = 3; selectedRepo = repoUrl">Continue</button>
      </div>
    </div>

    <!-- Step 2: Pick Repo -->
    <div v-if="step === 2" class="step-content">
      <h2 class="step-title">Pick a Repository</h2>
      <p class="step-desc">Select the repository you want to deploy.</p>
      <div class="repo-list">
        <button
          v-for="r in mockRepos"
          :key="r"
          class="repo-row"
          @click="selectRepo(r)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="18" height="18"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="mono">{{ r }}</span>
          <svg class="chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>

    <!-- Step 3: Configure -->
    <div v-if="step === 3 && !deployDone" class="step-content">
      <h2 class="step-title">Configure Deployment</h2>
      <p class="step-desc">Coolify will auto-detect your framework and settings.</p>

      <div class="config-card">
        <div class="form-group">
          <label class="form-label">Site Name</label>
          <input v-model="siteName" class="form-input" placeholder="my-awesome-site" />
        </div>

        <div class="form-group">
          <label class="form-label">Framework</label>
          <select v-model="framework" class="form-input">
            <option v-for="f in frameworks" :key="f" :value="f.toLowerCase().replace(' ', '')">{{ f }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Build Command</label>
          <input v-model="buildCmd" class="form-input mono" />
        </div>

        <div class="form-group">
          <label class="form-label">Output Directory</label>
          <input v-model="outputDir" class="form-input mono" />
        </div>

        <div class="form-group">
          <label class="form-label">Install Command</label>
          <input v-model="installCmd" class="form-input mono" />
        </div>

        <button class="btn btn-primary btn-lg" @click="deploy" :disabled="deploying || !siteName">
          <svg v-if="!deploying" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span v-if="deploying">Deploying...</span>
          <span v-else>Deploy Site</span>
        </button>

        <div v-if="deploying" class="deploy-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: deployProgress + '%' }"></div>
          </div>
          <div class="progress-log">
            <div class="log-line blink">▶ Building your site...</div>
            <div v-if="deployProgress > 30" class="log-line">✓ Dependencies installed</div>
            <div v-if="deployProgress > 60" class="log-line">✓ Build compiled</div>
            <div v-if="deployProgress > 85" class="log-line">✓ Uploading to CDN...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success -->
    <div v-if="deployDone" class="success-screen">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="success-title">Site Deployed!</h2>
      <p class="success-desc">
        Your site <strong>{{ siteName }}</strong> is live at<br>
        <a class="site-link" href="#" @click.prevent>https://{{ siteName }}.coolify.app</a>
      </p>
      <div class="success-actions">
        <button class="btn btn-primary" @click="emit('navigate', 'sites')">View All Sites</button>
        <button class="btn btn-ghost" @click="emit('navigate', 'dashboard')">Go to Dashboard</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 2rem; max-width: 680px; }

.page-header { margin-bottom: 2rem; }

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  margin-bottom: 0.75rem;
  transition: color 0.15s;
}

.back-btn:hover { color: var(--text-primary); }

.page-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }

.steps {
  display: flex;
  gap: 0;
  margin-bottom: 2.5rem;
  align-items: center;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: calc(28px + 0.625rem);
  right: 0;
  height: 1px;
  background: var(--border);
  top: 14px;
}

.step.done:not(:last-child)::after { background: var(--accent); }

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-base);
  flex-shrink: 0;
  z-index: 1;
  transition: all 0.2s;
}

.step.active .step-num { border-color: var(--accent); color: var(--accent); }
.step.done .step-num { border-color: var(--accent); background: var(--accent); color: white; }

.step-num svg { width: 14px; height: 14px; }

.step-label { font-size: 0.8125rem; color: var(--text-muted); z-index: 1; white-space: nowrap; }
.step.active .step-label { color: var(--text-primary); font-weight: 500; }

.step-content { }

.step-title { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; }
.step-desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; }

.provider-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.provider-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  transition: border-color 0.15s, transform 0.1s;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 500;
}

.provider-card:hover, .provider-card.selected {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.provider-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.provider-icon svg { width: 22px; height: 22px; }

.provider-initial { font-size: 1.125rem; font-weight: 700; }
.provider-label { font-size: 0.9375rem; font-weight: 500; }

.url-input-wrap {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.url-input-wrap .form-input { flex: 1; }

.repo-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

.repo-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.875rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}

.repo-row:last-child { border-bottom: none; }
.repo-row:hover { background: var(--bg-hover); }

.chevron-right { width: 16px; height: 16px; color: var(--text-muted); margin-left: auto; }

.config-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

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

.btn-lg { padding: 0.75rem 1.5rem; font-size: 1rem; justify-content: center; }

.deploy-progress { margin-top: 0.5rem; }

.progress-bar {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.progress-log {
  font-family: monospace;
  font-size: 0.8125rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #ccc;
  background: #0d0d0d;
  border-radius: 6px;
  padding: 0.75rem;
}

.log-line { }
.blink { animation: blink 1s infinite; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.success-screen {
  text-align: center;
  padding: 3rem 1rem;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: rgba(34,197,94,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #22c55e;
}

.success-icon svg { width: 32px; height: 32px; }

.success-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
.success-desc { font-size: 0.9375rem; color: var(--text-muted); margin-bottom: 2rem; line-height: 1.8; }
.site-link { color: var(--accent); font-family: monospace; }

.success-actions { display: flex; gap: 0.75rem; justify-content: center; }

.mono { font-family: monospace; }
</style>
