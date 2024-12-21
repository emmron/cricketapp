<script setup>
import CricketScorer from './components/CricketScorer.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Cricket Scorer</h1>
      <p class="subtitle">Track your cricket matches with ease</p>
    </header>

    <main>
      <CricketScorer />
    </main>

    <footer>
      <p>&copy; 2023 Cricket Scorer. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  line-height: 1.5;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #28a745, #20c997);
  padding: 2rem;
  color: white;
}

h1 {
  font-weight: 700;
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

main {
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 1200px;
  width: 95%;
}

footer {
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  color: #6c757d;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  main {
    padding: 1rem;
  }
}
</style>
