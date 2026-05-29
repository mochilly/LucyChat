<script setup lang="ts">
import { Sparkles } from '@lucide/vue'

const emit = defineEmits<{
  send: [text: string]
}>()

const suggestions = [
  '帮我写一首关于春天的诗',
  '解释一下量子计算的基本原理',
  '给我推荐几本提升认知的好书',
  '如何高效学习一门新编程语言？',
]

function handleClick(text: string) {
  emit('send', text)
}
</script>

<template>
  <div class="welcome">
    <div class="welcome__content">
      <div class="welcome__icon">
        <Sparkles :size="40" />
      </div>
      <h1 class="welcome__title">你好，我是 Lucy</h1>
      <p class="welcome__subtitle">有什么我可以帮助你的吗？</p>
    </div>

    <div class="welcome__suggestions">
      <button
        v-for="(text, i) in suggestions"
        :key="i"
        class="welcome__suggestion"
        @click="handleClick(text)"
      >
        {{ text }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  gap: var(--space-10);
  animation: fade-in var(--duration-slow) var(--ease-default);
}

.welcome__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.welcome__icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, #0071E3, #5856D6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: var(--space-2);
}

.welcome__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
}

.welcome__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-regular);
}

.welcome__suggestions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  max-width: 520px;
  width: 100%;
}

.welcome__suggestion {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: left;
  transition: all var(--duration-fast) var(--ease-default);
  line-height: var(--line-height-normal);
}

.welcome__suggestion:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-light);
  color: var(--color-text-primary);
}

@media (max-width: 520px) {
  .welcome__suggestions {
    grid-template-columns: 1fr;
  }

  .welcome__title {
    font-size: var(--font-size-xl);
  }

  .welcome__subtitle {
    font-size: var(--font-size-base);
  }
}
</style>
