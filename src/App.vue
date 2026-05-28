<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChatStore } from './stores/chat'
import Sidebar from './components/Sidebar.vue'
import ChatWindow from './components/ChatWindow.vue'

const store = useChatStore()
const sidebarVisible = ref(false)

function isMobile(): boolean {
  return window.innerWidth < 768
}

function openSidebar() {
  sidebarVisible.value = true
}

function closeSidebar() {
  sidebarVisible.value = false
}

onMounted(() => {
  store.initState()
})
</script>

<template>
  <div class="app-layout">
    <Sidebar
      :visible="sidebarVisible"
      @close="closeSidebar"
    />
    <ChatWindow
      class="main-content"
      @open-sidebar="openSidebar"
    />
  </div>
</template>
