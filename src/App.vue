<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Dashboard from './components/Dashboard.vue'
import SitesList from './components/SitesList.vue'
import SiteDetail from './components/SiteDetail.vue'
import NewSite from './components/NewSite.vue'
import Databases from './components/Databases.vue'
import Servers from './components/Servers.vue'
import Settings from './components/Settings.vue'
import ToastContainer from './components/ToastContainer.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import { theme, applyTheme } from './composables/useStore.js'

const currentPage = ref('dashboard')
const selectedSiteId = ref(null)
const sidebarCollapsed = ref(false)
const mobileOpen = ref(false)

onMounted(() => applyTheme(theme.value))

function navigate(page, data = null) {
  if (page === 'site-detail' && data != null) {
    selectedSiteId.value = typeof data === 'number' ? data : data?.id
  }
  currentPage.value = page
  mobileOpen.value = false
}
</script>

<template>
  <div class="app-shell">
    <!-- Mobile backdrop -->
    <Transition name="fade">
      <div v-if="mobileOpen" class="mobile-backdrop" @click="mobileOpen = false"></div>
    </Transition>

    <Sidebar
      :current-page="currentPage"
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileOpen"
      @navigate="navigate"
      @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
      @close-mobile="mobileOpen = false"
    />

    <div class="main-area" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Mobile header bar -->
      <header class="mobile-header">
        <button class="hamburger" @click="mobileOpen = true" aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="mobile-logo">
          <svg viewBox="0 0 32 32" fill="none" width="24" height="24">
            <rect width="32" height="32" rx="8" fill="#6366f1"/>
            <path d="M8 16l8-8 8 8-8 8-8-8z" fill="white" opacity="0.9"/>
            <path d="M13 16l3-3 3 3-3 3-3-3z" fill="#6366f1"/>
          </svg>
          <span>Coolify</span>
        </div>
      </header>

      <Dashboard v-if="currentPage === 'dashboard'" @navigate="navigate" />
      <SitesList v-else-if="currentPage === 'sites'" @navigate="navigate" />
      <SiteDetail v-else-if="currentPage === 'site-detail'" :site-id="selectedSiteId" @navigate="navigate" />
      <NewSite v-else-if="currentPage === 'new-site'" @navigate="navigate" />
      <Databases v-else-if="currentPage === 'databases'" />
      <Servers v-else-if="currentPage === 'servers'" />
      <Settings v-else-if="currentPage === 'settings'" />
    </div>

    <ToastContainer />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg-base);
  position: relative;
}

.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 90;
  backdrop-filter: blur(1px);
}

.main-area {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.25s ease;
  min-height: 100vh;
  overflow-x: hidden;
}

.main-area.sidebar-collapsed {
  margin-left: 64px;
}

.mobile-header {
  display: none;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-sidebar);
  position: sticky;
  top: 0;
  z-index: 50;
}

.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  padding: 4px;
  border-radius: 6px;
  display: flex;
}

.hamburger svg { width: 20px; height: 20px; }
.hamburger:hover { background: var(--bg-hover); }

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .main-area { margin-left: 0 !important; }
  .mobile-header { display: flex; }
}
</style>
