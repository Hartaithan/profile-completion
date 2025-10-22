<script setup lang="ts">
import { useAttrs, type ImgHTMLAttributes } from "vue";

interface Props {
  src: ImgHTMLAttributes["src"];
  alt: ImgHTMLAttributes["alt"];
  class?: ImgHTMLAttributes["class"];
}

const props = defineProps<Props>();
const attrs = useAttrs();
</script>

<template>
  <div
    :class="[
      'relative flex aspect-[20/11] h-14 w-auto flex-shrink-0 justify-center overflow-hidden rounded-md',
      props.class,
    ]">
    <img
      class="relative z-[3] h-full w-auto drop-shadow-md"
      v-bind="attrs"
      :src="props.src"
      :alt="props.alt" />
    <div class="absolute z-[2] size-full bg-black/30" />
    <img
      class="absolute z-[1] object-cover blur"
      v-bind="attrs"
      :src="props.src"
      :alt="`${props.alt} background`" />
  </div>
</template>
