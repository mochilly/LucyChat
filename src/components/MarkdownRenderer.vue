<script setup lang="ts">
import { computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import swift from 'highlight.js/lib/languages/swift'
import kotlin from 'highlight.js/lib/languages/kotlin'
import { Check, Copy } from '@lucide/vue'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('php', php)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('kotlin', kotlin)

const props = defineProps<{
  content: string
}>()

import 'highlight.js/styles/github.css'

const copied = ref(false)

function renderCodeBlock(str: string, lang: string): string {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const result = hljs.highlight(str, { language: lang, ignoreIllegals: true })
      return `<pre class="code-block"><div class="code-header"><span class="code-lang">${lang}</span><button class="code-copy-btn" data-code="${encodeURIComponent(str)}">复制</button></div><code class="hljs language-${lang}">${result.value}</code></pre>`
    } catch {
      // fallback
    }
  }
  const escaped = new MarkdownIt().utils.escapeHtml(str)
  return `<pre class="code-block"><div class="code-header"><span class="code-lang">text</span><button class="code-copy-btn" data-code="${encodeURIComponent(str)}">复制</button></div><code class="hljs">${escaped}</code></pre>`
}

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str: string, lang: string): string {
    return renderCodeBlock(str, lang)
  },
})

md.renderer.rules.fence = function (tokens: Token[], idx: number): string {
  const token = tokens[idx]
  const info = token.info.trim()
  const lang = info.split(/\s+/)[0] || ''
  return renderCodeBlock(token.content, lang)
}

const rendered = computed(() => md.render(props.content))

function handleCopyClick(e: Event) {
  const target = e.target as HTMLElement
  if (target.classList.contains('code-copy-btn')) {
    const code = decodeURIComponent(target.getAttribute('data-code') || '')
    navigator.clipboard.writeText(code)
    target.textContent = '已复制'
    setTimeout(() => {
      target.textContent = '复制'
    }, 1500)
  }
}
</script>

<template>
  <div
    class="md-content"
    v-html="rendered"
    @click="handleCopyClick"
  />
</template>

<style>
.md-content {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  word-break: break-word;
}

.md-content p {
  margin-bottom: 0.75em;
}

.md-content p:last-child {
  margin-bottom: 0;
}

.md-content strong {
  font-weight: var(--font-weight-semibold);
}

.md-content em {
  font-style: italic;
}

.md-content h1,
.md-content h2,
.md-content h3,
.md-content h4 {
  font-weight: var(--font-weight-semibold);
  margin: 1.2em 0 0.5em;
  line-height: var(--line-height-tight);
}

.md-content h1 { font-size: 1.4em; }
.md-content h2 { font-size: 1.25em; }
.md-content h3 { font-size: 1.1em; }

.md-content ul,
.md-content ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.md-content li {
  margin: 0.25em 0;
  list-style: disc;
}

.md-content ol li {
  list-style: decimal;
}

.md-content blockquote {
  border-left: 3px solid var(--color-primary);
  padding: 0.25em 0 0.25em 1em;
  margin: 0.75em 0;
  color: var(--color-text-secondary);
}

.md-content a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.md-content code:not(.hljs) {
  background: var(--color-inline-code-bg);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-family: var(--font-family-mono);
  font-size: 0.875em;
}

.md-content .code-block {
  background: var(--color-code-bg);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin: 0.75em 0;
  position: relative;
}

.md-content .code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  background: var(--color-code-header);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.md-content .code-lang {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-weight-medium);
}

.md-content .code-copy-btn {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
}

.md-content .code-copy-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.md-content .code-block code.hljs {
  display: block;
  padding: var(--space-4);
  overflow-x: auto;
  font-family: var(--font-family-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  background: transparent;
}

.md-content hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 1em 0;
}

.md-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.75em 0;
  font-size: var(--font-size-sm);
  overflow-x: auto;
  display: block;
}

.md-content th,
.md-content td {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  text-align: left;
}

.md-content th {
  background: var(--color-bg-secondary);
  font-weight: var(--font-weight-semibold);
}

@media (prefers-color-scheme: dark) {
  .hljs {
    color: #c9d1d9;
  }
  .hljs-comment,
  .hljs-quote {
    color: #8b949e;
    font-style: italic;
  }
  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-type {
    color: #ff7b72;
  }
  .hljs-literal,
  .hljs-number,
  .hljs-tag .hljs-attr,
  .hljs-template-variable,
  .hljs-variable {
    color: #79c0ff;
  }
  .hljs-string,
  .hljs-doctag,
  .hljs-regexp {
    color: #a5d6ff;
  }
  .hljs-title,
  .hljs-title.class_,
  .hljs-section,
  .hljs-selector-id {
    color: #d2a8ff;
    font-weight: bold;
  }
  .hljs-attr,
  .hljs-attribute {
    color: #79c0ff;
  }
  .hljs-symbol,
  .hljs-bullet {
    color: #ffa657;
  }
  .hljs-built_in,
  .hljs-name {
    color: #7ee787;
  }
  .hljs-meta {
    color: #8b949e;
  }
  .hljs-deletion {
    color: #ffdcd7;
    background-color: #67060c;
  }
  .hljs-addition {
    color: #aff5b4;
    background-color: #033a16;
  }
  .hljs-emphasis {
    font-style: italic;
  }
  .hljs-strong {
    font-weight: bold;
  }
}
</style>
