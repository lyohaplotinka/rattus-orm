<script setup lang="ts">
import { VPImage, VPButton } from 'vitepress/theme'
import { useData } from 'vitepress'
const { frontmatter, theme } = useData()

defineProps<{
  title: string
  package: string
  icon: string
  text: string
  docs: string
  demo: string
}>()
</script>

<template>
  <div class="RtIntegration">
    <article class="box">
      <VPImage
        :image="icon"
        :alt="title"
        class="integration-image"
      />
      <h2 class="title" v-html="title"></h2>
      <code class="integration-package">{{ package }}</code>
      <p class="details" v-html="text"></p>
      <div class="buttons-row">
        <VPButton :text="frontmatter.seeDocs" theme="alt" :href="docs" />
        <VPButton :text="frontmatter.liveDemo" theme="alt" :href="demo" />
      </div>
    </article>
  </div>
</template>

<style scoped>
.RtIntegration {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  text-align: center;
}

.RtIntegration.link:hover {
  border-color: var(--vp-c-brand-1);
}

:deep(.integration-image) {
  height: 90px;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5rem;
  padding: 24px 15px;
  height: 100%;
}

.title {
  line-height: 24px;
  font-weight: 600;
  border-top: none;
  padding-top: 0;
  margin: 0.5rem 0;
}

.details {
  flex-grow: 1;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin: 0;
}

.buttons-row {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.integration-package {
  font-size: 13px;
}

:deep(.VPButton) {
  line-height: 28px !important;
  text-decoration: none;
}
</style>
