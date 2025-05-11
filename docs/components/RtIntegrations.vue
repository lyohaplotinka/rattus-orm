<script setup lang="ts">
import { computed } from 'vue'
import RtIntegration from './RtIntegration.vue'

export interface Integration {
  title: string
  package: string
  icon: string
  text: string
  docs: string
  demo: string
}

const props = defineProps<{
  integrations: Integration[]
  sectionTitle?: string
}>()

const grid = computed(() => {
  const length = props.integrations.length

  if (!length) {
    return
  }
  if (length === 1) {
    return 'grid-6'
  }
  if (length === 2) {
    return 'grid-2'
  }
  if (length === 3) {
    return 'grid-3'
  }
  if (length % 3 === 0) {
    return 'grid-6'
  }
  if (length > 3) {
    return 'grid-4'
  }
})
</script>

<template>
  <div v-if="integrations" class="VPFeatures">
    <div class="vp-doc heading">
      <h1 v-if="sectionTitle" v-html="sectionTitle" />
    </div>
    <div class="container">
      <div class="items">
        <div
          v-for="integration in integrations"
          :key="integration.title"
          class="item"
          :class="[grid]"
        >
          <RtIntegration
            :demo="integration.demo"
            :docs="integration.docs"
            :package="integration.package"
            :text="integration.text"
            :icon="integration.icon"
            :title="integration.title"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPFeatures {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .VPFeatures {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .VPFeatures {
    padding: 0 64px;
  }
}

.heading {
  letter-spacing: -0.02em;
  line-height: 40px;
  font-size: 32px;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {
  .item.grid-2,
  .item.grid-4,
  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .item.grid-2,
  .item.grid-4 {
    width: calc(100% / 2);
  }

  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 960px) {
  .item.grid-4 {
    width: calc(100% / 4);
  }
}

.heading {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
