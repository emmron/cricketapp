<script setup>
import FootballManager from './components/FootballManager.vue'
</script>

<template>
  <div class="app-container">
    <main class="main-content">
      <FootballManager />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <p class="footer-text">&copy; 2024 AFL Manager Simulator. Built with Vue 3 + Vite</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #0f2027, #203a43, #2c5364);
}

.main-content {
  flex: 1;
  padding: 2rem 1rem;
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-text {
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0.5rem;
  }

  .footer-text {
    font-size: 0.75rem;
  }
}
</style>
