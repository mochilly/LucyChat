<script setup lang="ts">
import { ref, onMounted, watch, nextTick, useTemplateRef } from 'vue'
import { Send, Square } from '@lucide/vue'

const props = defineProps<{
  disabled?: boolean
  streaming?: boolean
}>()

const emit = defineEmits<{
  send: [text: string]
  stop: []
}>()

const inputText = ref('')
const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef')

function handleSend() {
  const text = inputText.value.trim()
  if (!text || props.disabled) return
  emit('send', text)
  inputText.value = ''
  nextTick(() => adjustHeight())
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function adjustHeight() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

watch(inputText, () => nextTick(adjustHeight))

onMounted(() => {
  textareaRef.value?.focus()
})
</script>

<template>
  <div class="input-bar">
    <div class="input-bar__container">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        class="input-bar__textarea"
        :placeholder="streaming ? '正在回复中...' : '输入你的问题...'
          "
        :disabled="disabled || streaming"
        rows="1"
        @keydown="handleKeydown"
      />
      <div class="input-bar__actions">
        <button
          v-if="streaming"
          class="input-bar__btn input-bar__btn--stop"
          @click="emit('stop')"
          title="停止生成"
        >
          <Square :size="16" />
        </button>
        <button
          v-else
          class="input-bar__btn"
          :class="{ 'input-bar__btn--active': inputText.trim() && !disabled }"
          :disabled="!inputText.trim() || disabled"
          @click="handleSend"
          title="发送"
        >
          <Send :size="18" />
        </button>
      </div>
    </div>
    <p class="input-bar__hint">
      Lucy 可能会犯错，请核实重要信息。
    </p>
  </div>
</template>

<style scoped>
.input-bar {
  flex-shrink: 0;
  padding: var(--space-4) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.input-bar__container {
  width: 100%;
  max-width: var(--input-max-width);
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  background: var(--color-bg-input);
  border: 1px solid var(--color-border-input);
  border-radius: var(--radius-xl);
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
  transition: all var(--duration-fast) var(--ease-default);
  box-shadow: var(--shadow-sm);
}

.input-bar__container:focus-within {
  border-color: var(--color-border-input-focus);
  box-shadow: var(--shadow-input);
}

.input-bar__textarea {
  flex: 1;
  min-height: 24px;
  max-height: 160px;
  padding: var(--space-1) 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
  resize: none;
}

.input-bar__textarea::placeholder {
  color: var(--color-text-tertiary);
}

.input-bar__textarea:disabled {
  opacity: 0.6;
}

.input-bar__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.input-bar__btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  transition: all var(--duration-fast) var(--ease-default);
  flex-shrink: 0;
}

.input-bar__btn:disabled {
  cursor: default;
  opacity: 0.4;
}

.input-bar__btn--active {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

.input-bar__btn--active:hover {
  background: var(--color-primary-hover);
}

.input-bar__btn--stop {
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
}

.input-bar__btn--stop:hover {
  background: rgba(255, 59, 48, 0.2);
}

.input-bar__hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-align: center;
}

@media (max-width: 767px) {
  .input-bar {
    padding: var(--space-3) var(--space-4);
    padding-bottom: max(var(--space-3), env(safe-area-inset-bottom));
  }
}
</style>
