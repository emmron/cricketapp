import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

// Create Vue app instance
const app = createApp(App)

// Configure global error handling
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', {
    error: err,
    component: vm,
    info: info
  })
}

// Mount app to DOM
app.mount('#app')

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully:', registration)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  })
}
