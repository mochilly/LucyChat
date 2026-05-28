<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '../stores/chat'
import { formatTime } from '../utils/format'
import {
  MessageSquarePlus,
  Trash2,
  MessageSquare,
  X,
} from '@lucide/vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useChatStore()

const sortedSessions = computed(() => store.sortedSessions)

function handleNewChat() {
  store.createSession()
  emit('close')
}

function handleSelect(id: string) {
  store.selectSession(id)
  emit('close')
}

function handleDelete(e: Event, id: string) {
  e.stopPropagation()
  store.deleteSession(id)
}
</script>

<template>
  <Transition name="sidebar-overlay">
    <div
      v-if="visible"
      class="sidebar-overlay"
      @click="emit('close')"
    />
  </Transition>

  <aside
    class="sidebar"
    :class="{ 'sidebar--open': visible }"
  >
    <div class="sidebar__header">
      <span class="sidebar__title">LucyChat</span>
      <button
        class="sidebar__new-btn"
        @click="handleNewChat"
        title="新建对话"
      >
        <MessageSquarePlus :size="18" />
      </button>
    </div>

    <div class="sidebar__list">
      <div
        v-for="session in sortedSessions"
        :key="session.id"
        class="sidebar__item"
        :class="{ 'sidebar__item--active': session.id === store.activeSessionId }"
        @click="handleSelect(session.id)"
      >
        <MessageSquare :size="16" class="sidebar__item-icon" />
        <div class="sidebar__item-content">
          <span class="sidebar__item-title">{{ session.title }}</span>
          <span class="sidebar__item-time">{{ formatTime(session.updatedAt) }}</span>
        </div>
        <button
          class="sidebar__item-delete"
          @click="handleDelete($event, session.id)"
          title="删除对话"
        >
          <Trash2 :size="14" />
        </button>
      </div>

      <div v-if="sortedSessions.length === 0" class="sidebar__empty">
        <span>暂无对话</span>
      </div>
    </div>

    <button
      class="sidebar__close-mobile"
      @click="emit('close')"
    >
      <X :size="20" />
    </button>
  </aside>
</template>

<style scoped>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-bg-overlay);
  z-index: 90;
  animation: fade-in var(--duration-normal) var(--ease-default);
}

.sidebar-overlay-enter-active {
  animation: fade-in var(--duration-normal) var(--ease-default);
}

.sidebar-overlay-leave-active {
  animation: fade-in var(--duration-normal) var(--ease-default) reverse;
}

.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background: var(--color-bg-sidebar);
  backdrop-filter: var(--blur-sidebar);
  -webkit-backdrop-filter: var(--blur-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  transition: transform var(--duration-slow) var(--ease-out-expo);
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.sidebar__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.02em;
}

.sidebar__new-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--duration-fast) var(--ease-default);
}

.sidebar__new-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
}

.sidebar__list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  position: relative;
  min-height: 44px;
}

.sidebar__item:hover {
  background: var(--color-bg-hover);
}

.sidebar__item:hover .sidebar__item-delete {
  opacity: 1;
}

.sidebar__item--active {
  background: var(--color-bg-active);
}

.sidebar__item-icon {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
}

.sidebar__item--active .sidebar__item-icon {
  color: var(--color-primary);
}

.sidebar__item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__item-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text-primary);
}

.sidebar__item-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.sidebar__item-delete {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  opacity: 0;
  transition: all var(--duration-fast) var(--ease-default);
}

.sidebar__item-delete:hover {
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
}

.sidebar__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.sidebar__close-mobile {
  display: none;
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  background: var(--color-bg-hover);
}

@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: min(300px, 85vw);
    transform: translateX(-100%);
    box-shadow: var(--shadow-xl);
    z-index: 100;
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .sidebar__close-mobile {
    display: flex;
  }
}
</style>
