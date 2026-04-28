<script setup lang="ts">
import { Button } from "@/ui/button";
import { useDebounceFn } from "@vueuse/core";
import { ArrowUp } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";

const isVisible = ref(false);

const updateVisibility = () => {
  isVisible.value = window.scrollY > 300;
};

const handleScroll = useDebounceFn(updateVisibility, 200);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  updateVisibility();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <Transition name="fade">
    <Button
      v-if="isVisible"
      size="icon"
      variant="outline"
      class="fixed right-6 bottom-6 shadow-lg"
      @click="scrollToTop">
      <ArrowUp class="size-4" />
    </Button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
