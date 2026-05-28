<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useChatStore } from '../stores/chat'
import MessageBubble from './MessageBubble.vue'
import WelcomeScreen from './WelcomeScreen.vue'
import InputBar from './InputBar.vue'
import { useChat } from '../composables/useChat'
import { Menu } from '@lucide/vue'

const emit = defineEmits<{
  'open-sidebar': []
}>()

const store = useChatStore()
const { userInput, isLoading, sendMessage, stopGeneration } = useChat()

const scrollContainerRef = ref<HTMLDivElement | null>(null)
const shouldAutoScroll = ref(true)
const showScrollBtn = ref(false)

const messages = computed(() => store.activeSession?.messages ?? [])
const isStreaming = computed(() => store.isStreaming)

const parentRef = ref<HTMLDivElement | null>(null)

const virtualizerOptions = computed(() => ({
  count: messages.value.length,
  getScrollElement: () => parentRef.value,
  estimateSize: () => 100,
  overscan: 5,
}))
const virtualizer = useVirtualizer(virtualizerOptions)

watch(
  () => messages.value.length,
  async () => {
    if (shouldAutoScroll.value) {
      await nextTick()
      scrollToBottom()
    }
  }
)

watch(
  () => messages.value[messages.value.length - 1]?.content,
  async () => {
    if (shouldAutoScroll.value) {
      await nextTick()
      scrollToBottom()
    }
  }
)

function scrollToBottom() {
  if (!parentRef.value) return
  parentRef.value.scrollTo({
    top: parentRef.value.scrollHeight,
    behavior: 'smooth',
  })
}

function handleScroll() {
  const el = parentRef.value
  if (!el) return
  const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
  shouldAutoScroll.value = distFromBottom < 100
  showScrollBtn.value = distFromBottom > 200
}

function handleScrollToBottom() {
  shouldAutoScroll.value = true
  scrollToBottom()
}

function handleWelcomeSend(text: string) {
  userInput.value = text
  nextTick(() => sendMessage())
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-window">
    <header class="chat-window__header">
      <button
        class="chat-window__menu-btn"
        @click="emit('open-sidebar')"
      >
        <Menu :size="20" />
      </button>
      <h2 class="chat-window__title">
        {{ store.activeSession?.title || 'LucyChat' }}
      </h2>
      <div class="chat-window__header-spacer" />
    </header>

    <div
      v-if="!store.activeSession || messages.length === 0"
      class="chat-window__body"
    >
      <WelcomeScreen @send="handleWelcomeSend" />
    </div>

    <div
      v-else
      ref="parentRef"
      class="chat-window__messages"
      @scroll="handleScroll"
    >
      <div
        class="chat-window__messages-inner"
        :style="{ height: virtualizer.getTotalSize() + 'px', position: 'relative' }"
      >
        <div
          v-for="row in virtualizer.getVirtualItems()"
          :key="String(row.key)"
          class="chat-window__virtual-item"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${row.start}px)`,
          }"
          :data-index="row.index"
          :ref="(el: any) => virtualizer.measureElement(el)"
        >
          <MessageBubble
            :message="messages[row.index]"
            :is-last="row.index === messages.length - 1"
            :streaming="isStreaming"
          />
        </div>
      </div>
    </div>

    <Transition name="scroll-btn">
      <button
        v-if="showScrollBtn"
        class="chat-window__scroll-btn"
        @click="handleScrollToBottom"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </Transition>

    <InputBar
      :disabled="false"
      :streaming="isStreaming"
      @send="sendMessage"
      @stop="stopGeneration"
    />
  </div>
</template>

<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  position: relative;
  background: var(--color-bg-primary);
}

.chat-window__header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-bg-sidebar);
  backdrop-filter: var(--blur-background);
  -webkit-backdrop-filter: var(--blur-background);
  gap: var(--space-3);
  z-index: 10;
}

.chat-window__menu-btn {
  display: none;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--duration-fast) var(--ease-default);
  flex-shrink: 0;
}

.chat-window__menu-btn:hover {
  background: var(--color-bg-hover);
}

.chat-window__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.chat-window__header-spacer {
  flex-shrink: 0;
  width: 36px;
}

.chat-window__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-window__messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-4) var(--space-6);
  scroll-behavior: smooth;
}

.chat-window__messages-inner {
  max-width: var(--message-max-width);
  margin: 0 auto;
  width: 100%;
}

.chat-window__virtual-item {
  padding: var(--space-1) 0;
}

.chat-window__scroll-btn {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  z-index: 5;
  transition: all var(--duration-fast) var(--ease-default);
  cursor: pointer;
}

.chat-window__scroll-btn:hover {
  box-shadow: var(--shadow-lg);
  color: var(--color-text-primary);
}

.scroll-btn-enter-active,
.scroll-btn-leave-active {
  transition: all var(--duration-normal) var(--ease-default);
}

.scroll-btn-enter-from,
.scroll-btn-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

@media (max-width: 767px) {
  .chat-window__menu-btn {
    display: flex;
  }

  .chat-window__header {
    padding: var(--space-3) var(--space-4);
  }

  .chat-window__messages {
    padding: var(--space-3) var(--space-4);
  }

  .chat-window__header-spacer {
    display: none;
  }
}
</style>
