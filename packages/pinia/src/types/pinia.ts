import type { Pinia } from 'pinia'

interface ComponentCustomPropertiesBase {
  $pinia: Pinia
}

declare module 'vue' {
  interface ComponentCustomProperties extends ComponentCustomPropertiesBase {}
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends ComponentCustomPropertiesBase {}
}
