<script setup>
import { ref, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Dashboard from './components/Dashboard.vue'
import SitesList from './components/SitesList.vue'
import SiteDetail from './components/SiteDetail.vue'
import NewSite from './components/NewSite.vue'
import Databases from './components/Databases.vue'
import Servers from './components/Servers.vue'
import Settings from './components/Settings.vue'

const currentPage = ref('dashboard')
const selectedSite = ref(null)
const sidebarCollapsed = ref(false)

function navigate(page, data = null) {
  if (page === 'site-detail' && data) {
    selectedSite.value = data
  }
  currentPage.value = page
}
</script>

<template>
  <div class="app-shell">
    <Sidebar
      :current-page="currentPage"
      :collapsed="sidebarCollapsed"
      @navigate="navigate"
      @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
    />
    <div class="main-area" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <Dashboard v-if="currentPage === 'dashboard'" @navigate="navigate" />
      <SitesList v-else-if="currentPage === 'sites'" @navigate="navigate" />
      <SiteDetail v-else-if="currentPage === 'site-detail'" :site="selectedSite" @navigate="navigate" />
      <NewSite v-else-if="currentPage === 'new-site'" @navigate="navigate" />
      <Databases v-else-if="currentPage === 'databases'" />
      <Servers v-else-if="currentPage === 'servers'" />
      <Settings v-else-if="currentPage === 'settings'" />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg-base);
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
</style>
