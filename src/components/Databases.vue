<script setup>
import { ref } from 'vue'
import { databases, addDatabase, deleteDatabase, toggleDbStatus, toast } from '../composables/useStore.js'

const showModal = ref(false)
const selectedType = ref(null)
const newDbName = ref('')
const newDbVersion = ref('latest')
const newDbPass = ref('')

const dbTypes = [
  { id: 'postgres', label: 'PostgreSQL', color: '#336791' },
  { id: 'mysql', label: 'MySQL', color: '#4479A1' },
  { id: 'redis', label: 'Redis', color: '#DC382D' },
  { id: 'mongodb', label: 'MongoDB', color: '#00ED64' },
  { id: 'mariadb', label: 'MariaDB', color: '#C0765A' },
]

const typeLabels = { postgres: 'PostgreSQL', mysql: 'MySQL', redis: 'Redis', mongodb: 'MongoDB', mariadb: 'MariaDB' }

function openModal() {
  selectedType.value = null
  newDbName.value = ''
  newDbVersion.value = 'latest'
  newDbPass.value = ''
  showModal.value = true
}

function handleCreate() {
  if (!selectedType.value || !newDbName.value.trim()) return
  const typeLabel = typeLabels[selectedType.value]
  const ports = { postgres: '5432', mysql: '3306', redis: '6379', mongodb: '27017', mariadb: '3306' }
  addDatabase({
    name: newDbName.value.trim(),
    type: typeLabel,
    version: newDbVersion.value === 'latest' ? 'latest' : newDbVersion.value,
    size: '0 MB',
    host: newDbName.value.trim() + '.internal:' + ports[selectedType.value],
  })
  showModal.value = false
}

function copyConnString(db) {
  const str = `${db.type.toLowerCase()}://root:password@${db.host}`
  navigator.clipboard?.writeText(str)
  toast('Connection string copied', 'info')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Databases</h1>
        <p class="page-subtitle">{{ databases.length }} database{{ databases.length !== 1 ? 's' : '' }} managed</p>
      </div>
      <button class="btn btn-primary" @click="openModal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M12 4v16m8-8H4" stroke-linecap="round"/></svg>
        New Database
      </button>
    </div>

    <div class="db-grid" v-if="databases.length">
      <div v-for="db in databases" :key="db.id" class="db-card">
        <div class="db-card-header">
          <div class="db-type-badge" :class="db.type.toLowerCase().replace(' ', '')">{{ db.type }}</div>
          <div class="db-status" :class="db.status">
            <span class="status-dot" :class="{ pulse: db.status === 'running' }"></span>
            {{ db.status === 'running' ? 'Running' : 'Stopped' }}
          </div>
        </div>

        <div class="db-name mono">{{ db.name }}</div>

        <div class="db-meta">
          <div class="meta-row">
            <span class="meta-key">Version</span>
            <span class="meta-val">{{ db.type }} {{ db.version }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-key">Size</span>
            <span class="meta-val">{{ db.size }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-key">Connections</span>
            <span class="meta-val">{{ db.connections }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-key">Host</span>
            <span class="meta-val mono small">{{ db.host }}</span>
          </div>
        </div>

        <div class="db-actions">
          <button class="btn btn-ghost btn-sm" @click="copyConnString(db)" title="Copy connection string">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round"/></svg>
            Copy URL
          </button>
          <button class="btn btn-ghost btn-sm" @click="toast('Backup started', 'info')">Backup</button>
          <button
            v-if="db.status === 'running'"
            class="btn btn-warning btn-sm"
            @click="toggleDbStatus(db.id)"
          >Stop</button>
          <button
            v-else
            class="btn btn-primary btn-sm"
            @click="toggleDbStatus(db.id)"
          >Start</button>
          <button class="btn btn-danger-ghost btn-sm" @click="deleteDatabase(db.id)">Delete</button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
        <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke-linecap="round"/>
      </svg>
      <p>No databases yet</p>
      <button class="btn btn-primary" @click="openModal">Create your first database</button>
    </div>

    <!-- Create Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <Transition name="scale" appear>
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title">New Database</h2>
              <button class="modal-close" @click="showModal = false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round"/></svg>
              </button>
            </div>
            <div class="modal-body">
              <p class="modal-desc">Choose a database engine and configure it.</p>
              <div class="db-type-grid">
                <button
                  v-for="t in dbTypes" :key="t.id"
                  class="db-type-btn" :class="{ selected: selectedType === t.id }"
                  @click="selectedType = t.id; if (!newDbName) newDbName = t.id + '-db'"
                >
                  <div class="db-type-dot" :style="{ background: t.color }"></div>
                  {{ t.label }}
                </button>
              </div>
              <div v-if="selectedType" class="db-form">
                <div class="form-group">
                  <label class="form-label">Database Name</label>
                  <input v-model="newDbName" class="form-input mono" :placeholder="selectedType + '-db'" @keyup.enter="handleCreate" />
                </div>
                <div class="form-group">
                  <label class="form-label">Version</label>
                  <select v-model="newDbVersion" class="form-input">
                    <option value="latest">Latest (recommended)</option>
                    <option value="16">16</option>
                    <option value="15">15</option>
                    <option value="14">14</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Root Password</label>
                  <input v-model="newDbPass" class="form-input" type="password" placeholder="Leave blank to auto-generate" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="showModal = false">Cancel</button>
              <button class="btn btn-primary" :disabled="!selectedType || !newDbName.trim()" @click="handleCreate">
                Create Database
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
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

.db-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1rem; }

.db-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: border-color 0.15s;
}

.db-card:hover { border-color: rgba(99,102,241,0.4); }

.db-card-header { display: flex; justify-content: space-between; align-items: center; }

.db-type-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.db-type-badge.postgresql { background: rgba(51,103,145,0.2); color: #5ba3d0; }
.db-type-badge.redis { background: rgba(220,56,45,0.2); color: #f07167; }
.db-type-badge.mongodb { background: rgba(0,237,100,0.15); color: #00ed64; }
.db-type-badge.mysql { background: rgba(68,121,161,0.2); color: #6ab0d9; }
.db-type-badge.mariadb { background: rgba(192,118,90,0.2); color: #d4917a; }

.db-status {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.db-status.running { color: #22c55e; }
.db-status.stopped { color: var(--text-muted); }

.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.status-dot.pulse { animation: pulse 2s infinite; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.db-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); }

.db-meta { display: flex; flex-direction: column; gap: 0.375rem; }

.meta-row { display: flex; justify-content: space-between; font-size: 0.8125rem; }
.meta-key { color: var(--text-muted); }
.meta-val { color: var(--text-primary); font-weight: 500; }
.meta-val.small { font-size: 0.75rem; }

.db-actions {
  display: flex;
  gap: 0.375rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
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

.mono { font-family: monospace; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0,0,0,0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); }

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  display: flex;
}

.modal-close svg { width: 18px; height: 18px; }
.modal-close:hover { color: var(--text-primary); background: var(--bg-hover); }

.modal-body { padding: 1.5rem; }
.modal-desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem; }

.db-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1.25rem; }

.db-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 0.5rem;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--text-primary);
  font-family: inherit;
  transition: border-color 0.15s;
}

.db-type-btn:hover, .db-type-btn.selected { border-color: var(--accent); }

.db-type-dot { width: 20px; height: 20px; border-radius: 4px; }

.db-form { display: flex; flex-direction: column; gap: 0.875rem; }

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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scale-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-leave-active { transition: all 0.15s ease; }
.scale-enter-from { opacity: 0; transform: scale(0.85); }
.scale-leave-to { opacity: 0; transform: scale(0.9); }
</style>
