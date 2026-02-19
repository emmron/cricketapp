<script setup>
import { confirmState, resolveConfirm } from '../composables/useStore.js'

function onKeydown(e) {
  if (!confirmState.value.open) return
  if (e.key === 'Escape') resolveConfirm(false)
  if (e.key === 'Enter') resolveConfirm(true)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="confirmState.open"
        class="overlay"
        @click.self="resolveConfirm(false)"
        @keydown.window="onKeydown"
      >
        <Transition name="scale" appear>
          <div class="dialog" role="alertdialog" aria-modal="true">
            <div class="dialog-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="dialog-body">
              <h2 class="dialog-title">{{ confirmState.title }}</h2>
              <p class="dialog-msg">{{ confirmState.message }}</p>
            </div>
            <div class="dialog-actions">
              <button class="btn btn-ghost" @click="resolveConfirm(false)">Cancel</button>
              <button class="btn btn-danger" @click="resolveConfirm(true)" autofocus>Confirm</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.dialog {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.75rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 25px 60px rgba(0,0,0,0.5);
}

.dialog-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(239,68,68,0.15);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.dialog-icon svg { width: 24px; height: 24px; }

.dialog-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.dialog-msg {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Fade overlay */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Scale dialog */
.scale-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-leave-active { transition: all 0.15s ease; }
.scale-enter-from { opacity: 0; transform: scale(0.85); }
.scale-leave-to { opacity: 0; transform: scale(0.9); }
</style>
