<script setup>
import { toasts, dismiss } from '../composables/useStore.js'
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="t.type"
          @click="dismiss(t.id)"
        >
          <div class="toast-icon">
            <svg v-if="t.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="t.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="toast-msg">{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  min-width: 240px;
  max-width: 360px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  cursor: pointer;
  pointer-events: all;
  border: 1px solid transparent;
}

.toast.success {
  background: #166534;
  color: #86efac;
  border-color: rgba(134,239,172,0.2);
}

.toast.error {
  background: #7f1d1d;
  color: #fca5a5;
  border-color: rgba(252,165,165,0.2);
}

.toast.info {
  background: #1e3a5f;
  color: #93c5fd;
  border-color: rgba(147,197,253,0.2);
}

[data-theme="light"] .toast.success { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
[data-theme="light"] .toast.error { background: #fee2e2; color: #7f1d1d; border-color: #fecaca; }
[data-theme="light"] .toast.info { background: #dbeafe; color: #1e3a5f; border-color: #bfdbfe; }

.toast-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.toast-icon svg { width: 18px; height: 18px; }

.toast-msg {
  line-height: 1.4;
  flex: 1;
}

/* Transitions */
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>
