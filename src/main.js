import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Error handling
app.config.errorHandler = (err) => {
  console.error('Global error:', err)
}

// Mount the app
app.mount('#app')

// PWA registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration)
      })
      .catch(error => {
        console.error('SW registration failed:', error)
      })
  })
}
