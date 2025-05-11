<script setup lang="ts">
import RtLoader from './RtLoader.vue'
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { previewSrc } = defineProps<{ previewSrc?: string }>()

const { frontmatter } = useData()
const iframeHeight = ref(0)
const showLoader = ref(true)

const src = computed(() => {
  return previewSrc ?? frontmatter.value.liveDemoUrl
})

const onIframeLoad = () => {
  iframeHeight.value = undefined
  showLoader.value = false
}
</script>

<template>
    <div class="rt-live-demo__placeholder" v-if="showLoader">
      <rt-loader />
    </div>
    <iframe class="rt-live-demo" :style="{ height: iframeHeight }" :src="src" @load="onIframeLoad" />
</template>

<style lang="scss" scoped>
@mixin base {
  width: 100%;
  height: 500px;
  margin-top: 1rem;
}

.rt-live-demo {
  @include base;
  border: none;

  &__placeholder {
    @include base;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::after {
      z-index: -1;
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background-image: linear-gradient(90deg, transparent 25%, rgb(82, 82, 82) 50%, transparent 75%),
      linear-gradient(#3b3b3b 100%, transparent 0);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: -1000px 0, center 0;
      box-sizing: border-box;
      animation: loading 1s linear infinite;
    }
  }

  @keyframes loading {
    to {
      background-position: 1000px 0, center 0;
    }
  }

  @media screen and (max-width: 800px) {
    .previewIframe {
      height: 65vh;
    }
  }
}
</style>
