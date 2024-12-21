<script setup>
import CricketScorer from './components/CricketScorer.vue'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="title">Cricket Scorer</h1>
        <p class="subtitle">Track your cricket matches with ease</p>
      </div>
    </header>

    <main class="main-content">
      <CricketScorer />
    </main>

    <footer class="app-footer">
      <p class="footer-text">&copy; 2023 Cricket Scorer. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.app-header {
  background: linear-gradient(135deg, #28a745, #20c997);
  padding: 2.5rem 1rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.title {
  font-weight: 800;
  font-size: 3.5rem;
  margin-bottom: 0.75rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #ffffff, #e6e6e6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleFade 0.8s ease-out;
}

@keyframes titleFade {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle {
  font-size: 1.3rem;
  opacity: 0.95;
  font-weight: 500;
  animation: subtitleFade 0.8s ease-out 0.2s both;
}

@keyframes subtitleFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 0.95;
    transform: translateY(0);
  }
}

.main-content {
  flex: 1;
  padding: 2.5rem 1.5rem;
  margin: 2rem auto;
  max-width: 1200px;
  width: 95%;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.main-content:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #ffffff;
  color: #6c757d;
  border-top: 1px solid #eaeaea;
}

.footer-text {
  font-size: 0.95rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.footer-text:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .main-content {
    padding: 1.5rem 1rem;
    margin: 1rem auto;
    width: 92%;
  }

  .app-header {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .main-content {
    padding: 1rem;
    border-radius: 12px;
  }
}
</style>
