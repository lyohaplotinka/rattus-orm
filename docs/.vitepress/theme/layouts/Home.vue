<script setup lang="ts">
import { VPHomeFeatures, VPHomeHero, VPHomeContent } from 'vitepress/theme'
import { Content, useData } from 'vitepress'
import RtIntegrations from '../components/RtIntegrations.vue'

const { frontmatter, theme } = useData()
console.log(frontmatter.value.integrations)
</script>

<template>
  <div
    class="VPHome"
    :class="{
      'external-link-icon-enabled': theme.externalLinkIcon
    }">
    <slot name="home-hero-before" />
    <VPHomeHero>
      <template #home-hero-info-before><slot name="home-hero-info-before" /></template>
      <template #home-hero-info><slot name="home-hero-info" /></template>
      <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
      <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
      <template #home-hero-image><slot name="home-hero-image" /></template>
    </VPHomeHero>

    <VPHomeContent class="index-page-block">
      <h1>{{ frontmatter.threeLibsTitle }}</h1>
      <img src="/images/three-libs-demo.png" alt="Three libraries demo" class="three-libs-demo" />
    </VPHomeContent>

    <RtIntegrations :integrations="frontmatter.integrations" :section-title="frontmatter.integrationsTitle" />
    <RtIntegrations class="mt-6" :integrations="frontmatter.plugins" :section-title="frontmatter.pluginsTitle" />

    <VPHomeFeatures class="mt-6" />

    <VPHomeContent v-if="frontmatter.markdownStyles !== false">
      <Content />
    </VPHomeContent>
    <Content v-else />
  </div>
</template>

<style scoped lang="scss">
.VPHome {
  margin-bottom: 96px;
}

@media (min-width: 768px) {
  .VPHome {
    margin-bottom: 128px;
  }
}

.three-libs-demo {
  max-width: 100%;
  width: 55rem;
  display: inline-block;
}

.index-page-block {
  text-align: center;
  margin-bottom: 4rem;
  > h1 {
    margin-bottom: 1rem;
  }
}

.mt-6 {
 margin-top: 6rem;
}

:deep(.VPFeature) {
  .box {
    align-items: center;
  }

  .details {
    text-align: center;
  }

  .VPImage {
    height: 70px;
    width: auto;
  }
}
</style>
