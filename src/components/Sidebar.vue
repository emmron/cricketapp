<script setup>
defineProps({
  currentPage: String,
  collapsed: Boolean,
})
const emit = defineEmits(['navigate', 'toggle-collapse'])

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'sites', label: 'Sites', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { id: 'databases', label: 'Databases', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
  { id: 'servers', label: 'Servers', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <div class="logo-wrap" @click="emit('navigate', 'dashboard')">
        <div class="logo-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#6366f1"/>
            <path d="M8 16l8-8 8 8-8 8-8-8z" fill="white" opacity="0.9"/>
            <path d="M13 16l3-3 3 3-3 3-3-3z" fill="#6366f1"/>
          </svg>
        </div>
        <span v-if="!collapsed" class="logo-text">Coolify</span>
      </div>
      <button class="collapse-btn" @click="emit('toggle-collapse')" :title="collapsed ? 'Expand' : 'Collapse'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="!collapsed" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
          <path v-else d="M13 5l7 7-7 7M6 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <nav class="sidebar-nav">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: currentPage === item.id || (item.id === 'sites' && currentPage === 'site-detail') }"
        @click="emit('navigate', item.id)"
        :title="collapsed ? item.label : ''"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" v-if="!collapsed">
        <div class="avatar">A</div>
        <div class="user-details">
          <div class="user-name">Admin</div>
          <div class="user-role">Owner</div>
        </div>
      </div>
      <div class="avatar" v-else title="Admin">A</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  z-index: 100;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border);
  min-height: 64px;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  flex: 1;
  overflow: hidden;
}

.logo-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-icon svg {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  letter-spacing: -0.02em;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-muted);
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
}

.collapse-btn:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.collapse-btn svg {
  width: 16px;
  height: 16px;
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-subtle);
  color: var(--accent);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
}

.avatar {
  width: 32px;
  height: 32px;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  cursor: default;
}

.user-details {
  overflow: hidden;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
