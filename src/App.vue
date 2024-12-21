<script setup>
import CricketScorer from './components/CricketScorer.vue'
</script>

<template>
  <header>
    <h1 class="green">Cricket Scorer</h1>
  </header>

  <main>
    <CricketScorer />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  text-align: center;
  margin-bottom: 2rem;
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 2px solid #e9ecef;
}

h1 {
  font-weight: 600;
  font-size: 3rem;
  color: #28a745;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

main {
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
