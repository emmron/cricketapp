<script setup>
import { ref } from 'vue'

const activeSection = ref('general')
const teamMembers = ref([
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Owner', avatar: 'A' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Admin', avatar: 'B' },
  { name: 'Carol White', email: 'carol@example.com', role: 'Member', avatar: 'C' },
])
const inviteEmail = ref('')
const instanceName = ref('My Coolify')
const instanceUrl = ref('https://coolify.example.com')
const saved = ref(false)

const sections = [
  { id: 'general', label: 'General' },
  { id: 'team', label: 'Team' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
]

function save() {
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your Coolify instance</p>
    </div>

    <div class="settings-layout">
      <!-- Sidebar nav -->
      <div class="section-nav">
        <button
          v-for="s in sections"
          :key="s.id"
          class="section-btn"
          :class="{ active: activeSection === s.id }"
          @click="activeSection = s.id"
        >{{ s.label }}</button>
      </div>

      <!-- Content -->
      <div class="section-content">

        <!-- General -->
        <div v-if="activeSection === 'general'" class="settings-panel">
          <h2 class="panel-title">General Settings</h2>
          <div class="form-group">
            <label class="form-label">Instance Name</label>
            <input v-model="instanceName" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Instance URL</label>
            <input v-model="instanceUrl" class="form-input mono" />
          </div>
          <div class="form-group">
            <label class="form-label">Default Build Image</label>
            <select class="form-input">
              <option>node:18-alpine</option>
              <option>node:20-alpine</option>
              <option>bun:1-alpine</option>
            </select>
          </div>
          <div class="toggle-group">
            <div class="toggle-info">
              <div class="toggle-label">Enable Preview Deployments</div>
              <div class="toggle-desc">Automatically deploy pull requests as preview URLs</div>
            </div>
            <div class="toggle active"></div>
          </div>
          <div class="toggle-group">
            <div class="toggle-info">
              <div class="toggle-label">Auto-deploy on Push</div>
              <div class="toggle-desc">Deploy automatically when code is pushed to the main branch</div>
            </div>
            <div class="toggle active"></div>
          </div>
          <div class="toggle-group">
            <div class="toggle-info">
              <div class="toggle-label">Collect Analytics</div>
              <div class="toggle-desc">Send anonymous usage data to help improve Coolify</div>
            </div>
            <div class="toggle"></div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" @click="save">
              <span v-if="saved">✓ Saved!</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </div>

        <!-- Team -->
        <div v-if="activeSection === 'team'" class="settings-panel">
          <div class="panel-header">
            <h2 class="panel-title">Team Members</h2>
          </div>
          <div class="member-list">
            <div v-for="m in teamMembers" :key="m.email" class="member-row">
              <div class="member-avatar">{{ m.avatar }}</div>
              <div class="member-info">
                <div class="member-name">{{ m.name }}</div>
                <div class="member-email">{{ m.email }}</div>
              </div>
              <select class="role-select" :value="m.role">
                <option>Owner</option>
                <option>Admin</option>
                <option>Member</option>
                <option>Viewer</option>
              </select>
              <button v-if="m.role !== 'Owner'" class="btn btn-danger-ghost btn-sm">Remove</button>
            </div>
          </div>
          <div class="invite-wrap">
            <input v-model="inviteEmail" class="form-input" placeholder="colleague@example.com" type="email" />
            <button class="btn btn-primary btn-sm" :disabled="!inviteEmail">Invite</button>
          </div>
        </div>

        <!-- Security -->
        <div v-if="activeSection === 'security'" class="settings-panel">
          <h2 class="panel-title">Security</h2>
          <div class="security-section">
            <h3 class="sub-title">Two-Factor Authentication</h3>
            <p class="sub-desc">Add an extra layer of security to your account.</p>
            <button class="btn btn-primary btn-sm">Enable 2FA</button>
          </div>
          <div class="security-section">
            <h3 class="sub-title">API Keys</h3>
            <p class="sub-desc">Manage API keys for programmatic access.</p>
            <div class="api-key-row">
              <span class="mono api-key-value">ck_live_••••••••••••••••</span>
              <button class="btn btn-ghost btn-sm">Reveal</button>
              <button class="btn btn-danger-ghost btn-sm">Revoke</button>
            </div>
            <button class="btn btn-ghost btn-sm" style="margin-top: 0.75rem;">Generate New Key</button>
          </div>
          <div class="security-section">
            <h3 class="sub-title">Change Password</h3>
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input type="password" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input type="password" class="form-input" />
            </div>
            <button class="btn btn-primary btn-sm">Update Password</button>
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeSection === 'notifications'" class="settings-panel">
          <h2 class="panel-title">Notifications</h2>
          <div class="form-group">
            <label class="form-label">Notification Email</label>
            <input class="form-input" value="admin@example.com" type="email" />
          </div>
          <div class="notif-list">
            <div v-for="n in [
              { label: 'Deployment Success', desc: 'Notify when a deployment succeeds' },
              { label: 'Deployment Failed', desc: 'Notify when a deployment fails' },
              { label: 'Domain Issues', desc: 'Notify on SSL or DNS problems' },
              { label: 'Team Invites', desc: 'Notify when someone joins your team' },
            ]" :key="n.label" class="notif-row">
              <div class="notif-info">
                <div class="notif-label">{{ n.label }}</div>
                <div class="notif-desc">{{ n.desc }}</div>
              </div>
              <div class="toggle active"></div>
            </div>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Slack Webhook URL</label>
            <input class="form-input mono" placeholder="https://hooks.slack.com/services/..." />
          </div>
          <button class="btn btn-primary">Save Preferences</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 2rem; max-width: 900px; }

.page-header { margin-bottom: 2rem; }
.page-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
.page-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem; }

.settings-layout { display: grid; grid-template-columns: 180px 1fr; gap: 2rem; }

.section-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-btn {
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s, color 0.1s;
}

.section-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
.section-btn.active { background: var(--accent-subtle); color: var(--accent); font-weight: 500; }

.settings-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); }

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

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--border);
}

.toggle-group:last-of-type { border-bottom: none; }

.toggle-label { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
.toggle-desc { font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }

.toggle {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--border);
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
  transition: background 0.2s;
}

.toggle::after {
  content: '';
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.2s;
}

.toggle.active { background: var(--accent); }
.toggle.active::after { transform: translateX(18px); }

.form-actions { display: flex; justify-content: flex-end; }

.member-list { display: flex; flex-direction: column; gap: 0.5rem; }

.member-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.member-row:last-child { border-bottom: none; }

.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.member-info { flex: 1; }
.member-name { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
.member-email { font-size: 0.75rem; color: var(--text-muted); }

.role-select {
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  color: var(--text-primary);
  font-size: 0.8125rem;
  cursor: pointer;
}

.invite-wrap {
  display: flex;
  gap: 0.625rem;
  align-items: center;
  padding-top: 0.75rem;
}

.invite-wrap .form-input { flex: 1; }

.security-section {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.security-section:last-child { border-bottom: none; }

.sub-title { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.sub-desc { font-size: 0.8125rem; color: var(--text-muted); }

.api-key-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.375rem 0.625rem;
}

.api-key-value { flex: 1; font-size: 0.8125rem; color: var(--text-muted); }

.notif-list { display: flex; flex-direction: column; }

.notif-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--border);
}

.notif-row:last-child { border-bottom: none; }

.notif-label { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
.notif-desc { font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }

.mono { font-family: monospace; }

@media (max-width: 640px) {
  .settings-layout { grid-template-columns: 1fr; }
  .section-nav { flex-direction: row; overflow-x: auto; }
}
</style>
