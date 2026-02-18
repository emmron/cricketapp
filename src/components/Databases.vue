<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const selectedType = ref(null)

const databases = ref([
  { id: 1, name: 'prod-postgres', type: 'PostgreSQL', version: '16', status: 'running', size: '2.4 GB', connections: 12, host: 'db.internal:5432' },
  { id: 2, name: 'cache-redis', type: 'Redis', version: '7', status: 'running', size: '128 MB', connections: 34, host: 'redis.internal:6379' },
  { id: 3, name: 'analytics-mongo', type: 'MongoDB', version: '7', status: 'stopped', size: '8.1 GB', connections: 0, host: 'mongo.internal:27017' },
])

const dbTypes = [
  { id: 'postgres', label: 'PostgreSQL', color: '#336791' },
  { id: 'mysql', label: 'MySQL', color: '#4479A1' },
  { id: 'redis', label: 'Redis', color: '#DC382D' },
  { id: 'mongodb', label: 'MongoDB', color: '#00ED64' },
  { id: 'mariadb', label: 'MariaDB', color: '#C0765A' },
]
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Databases</h1>
        <p class="page-subtitle">{{ databases.length }} databases managed</p>
      </div>
      <button class="btn btn-primary" @click="showModal = true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4" stroke-linecap="round"/></svg>
        New Database
      </button>
    </div>

    <div class="db-grid">
      <div v-for="db in databases" :key="db.id" class="db-card">
        <div class="db-card-header">
          <div class="db-type-badge" :class="db.type.toLowerCase()">{{ db.type }}</div>
          <div class="db-status" :class="db.status">
            <span class="status-dot"></span>
            {{ db.status === 'running' ? 'Running' : 'Stopped' }}
          </div>
        </div>
        <div class="db-name">{{ db.name }}</div>
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
            <span class="meta-val mono">{{ db.host }}</span>
          </div>
        </div>
        <div class="db-actions">
          <button class="btn btn-ghost btn-sm">Connect</button>
          <button class="btn btn-ghost btn-sm">Backup</button>
          <button v-if="db.status === 'running'" class="btn btn-warning btn-sm">Stop</button>
          <button v-else class="btn btn-primary btn-sm">Start</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">New Database</h2>
          <button class="modal-close" @click="showModal = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">Choose a database engine to provision.</p>
          <div class="db-type-grid">
            <button
              v-for="t in dbTypes"
              :key="t.id"
              class="db-type-btn"
              :class="{ selected: selectedType === t.id }"
              @click="selectedType = t.id"
            >
              <div class="db-type-color" :style="{ background: t.color }"></div>
              {{ t.label }}
            </button>
          </div>
          <div v-if="selectedType" class="db-config-form">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input class="form-input" :placeholder="`my-${selectedType}`" />
            </div>
            <div class="form-group">
              <label class="form-label">Version</label>
              <select class="form-input">
                <option>Latest</option>
                <option>16</option>
                <option>15</option>
                <option>14</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Root Password</label>
              <input class="form-input" type="password" placeholder="Auto-generate" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showModal = false">Cancel</button>
          <button class="btn btn-primary" :disabled="!selectedType" @click="showModal = false">Create Database</button>
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

.db-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }

.db-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.db-card-header { display: flex; justify-content: space-between; align-items: center; }

.db-type-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.db-type-badge.postgresql { background: rgba(51,103,145,0.2); color: #5ba3d0; }
.db-type-badge.redis { background: rgba(220,56,45,0.2); color: #f07167; }
.db-type-badge.mongodb { background: rgba(0,237,100,0.15); color: #00ed64; }

.db-status {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.db-status.running { color: #22c55e; }
.db-status.stopped { color: var(--text-muted); }

.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.db-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); font-family: monospace; }

.db-meta { display: flex; flex-direction: column; gap: 0.375rem; }

.meta-row { display: flex; justify-content: space-between; font-size: 0.8125rem; }
.meta-key { color: var(--text-muted); }
.meta-val { color: var(--text-primary); font-weight: 500; }
.mono { font-family: monospace; font-size: 0.75rem; }

.db-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
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
  align-items: center;
}

.modal-close:hover { color: var(--text-primary); }
.modal-close svg { width: 18px; height: 18px; }

.modal-body { padding: 1.5rem; }
.modal-desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem; }

.db-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1.25rem; }

.db-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 0.5rem;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--text-primary);
  transition: border-color 0.15s;
}

.db-type-btn:hover, .db-type-btn.selected { border-color: var(--accent); }

.db-type-color { width: 24px; height: 24px; border-radius: 4px; }

.db-config-form { display: flex; flex-direction: column; gap: 0.875rem; }

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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
}
</style>
