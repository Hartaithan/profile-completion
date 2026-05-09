<script setup lang="ts">
import { AlertTriangleIcon, TargetIcon, TrophyIcon } from "lucide-vue-next";
</script>

<template>
  <div class="relative mt-8 justify-self-center sm:mt-12">
    <div
      class="bg-card border-border/50 flex size-16 items-center justify-center rounded-lg border sm:size-20">
      <TrophyIcon class="text-muted-foreground size-8 sm:size-10" />
    </div>
    <div
      class="bg-primary/20 border-primary/30 absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-lg border sm:-right-2 sm:-bottom-2 sm:size-7">
      <TargetIcon class="text-primary size-3 sm:size-3.5" />
    </div>
  </div>
  <h2
    class="text-foreground mt-4 text-center text-2xl font-black tracking-tight uppercase sm:mt-6 sm:text-4xl">
    Track Your Trophy Progress
  </h2>
  <p
    class="text-muted-foreground mt-2 text-center text-sm leading-relaxed sm:mt-0 sm:px-0 sm:text-base">
    Enter your PSN ID to start tracking your profile completion!
  </p>
  <div
    class="bg-card/50 border-border mt-6 flex items-center gap-3 justify-self-center rounded border p-3 sm:p-4">
    <AlertTriangleIcon class="text-chart-5 mt-0.5 size-4 shrink-0" />
    <p class="text-muted-foreground text-sm leading-relaxed">
      Just make sure your PSN profile is set to public so your trophy data can be accessed!
    </p>
  </div>
</template>
