<script setup lang="ts">
import { Skeleton } from "@/ui/skeleton";
</script>

<template>
  <div class="flex w-full items-center">
    <Skeleton class="aspect-[20/11] h-14" />
    <div class="ml-3">
      <Skeleton class="h-5 w-36" />
      <Skeleton class="mt-1 h-5 w-56" />
    </div>
    <Skeleton class="ml-auto size-9" />
  </div>
</template>
