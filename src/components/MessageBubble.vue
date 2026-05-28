<script setup lang="ts">
import type { Message } from '../types'
import MarkdownRenderer from './MarkdownRenderer.vue'
import { User } from '@lucide/vue'

defineProps<{
  message: Message
  isLast?: boolean
  streaming?: boolean
}>()
</script>

<template>
  <div
    class="bubble"
    :class="[
      `bubble--${message.role}`,
      { 'bubble--last': isLast },
    ]"
  >
    <div
      v-if="message.role === 'assistant'"
      class="bubble__avatar bubble__avatar--ai"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.3"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <div class="bubble__body">
      <div
        v-if="message.role === 'user'"
        class="bubble__text bubble__text--user"
      >{{ message.content }}</div>
      <MarkdownRenderer
        v-else
        :content="message.content"
      />

      <span
        v-if="message.role === 'assistant' && streaming && isLast"
        class="bubble__cursor"
      />
      <span
        v-if="message.role === 'assistant' && streaming && isLast && !message.content"
        class="bubble__loading"
      >
        <span class="bubble__loading-dot" />
        <span class="bubble__loading-dot" />
        <span class="bubble__loading-dot" />
      </span>
    </div>

    <div
      v-if="message.role === 'user'"
      class="bubble__avatar bubble__avatar--user"
    >
      <User :size="16" />
    </div>
  </div>
</template>

<style scoped>
.bubble {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  animation: fade-in-up var(--duration-slow) var(--ease-default);
}

.bubble--user {
  justify-content: flex-end;
}

.bubble--assistant {
  justify-content: flex-start;
}

.bubble__avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.bubble__avatar--ai {
  background: linear-gradient(135deg, #0071E3, #5856D6);
  color: white;
}

.bubble__avatar--user {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.bubble__body {
  max-width: var(--message-max-width);
  min-width: 0;
}

.bubble__text--user {
  background: var(--color-bg-user-bubble);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-sm);
  line-height: var(--line-height-relaxed);
  white-space: pre-wrap;
  word-break: break-word;
}

.bubble__cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: var(--color-primary);
  margin-left: 1px;
  vertical-align: text-bottom;
  animation: cursor-blink 800ms ease-in-out infinite;
}

.bubble__loading {
  display: inline-flex;
  gap: 4px;
  padding: var(--space-2) 0;
  align-items: center;
}

.bubble__loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
  animation: pulse-dot 1.4s ease-in-out infinite;
}

.bubble__loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.bubble__loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@media (max-width: 767px) {
  .bubble__body {
    max-width: 85%;
  }
}
</style>
