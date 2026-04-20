<script setup lang="ts">
import { AlertTriangleIcon, TargetIcon, TrophyIcon } from "lucide-vue-next";
</script>

<template>
  <div class="relative mt-12 justify-self-center">
    <div
      class="bg-card border-border/50 flex size-20 items-center justify-center rounded-lg border">
      <TrophyIcon class="text-muted-foreground size-10" />
    </div>
    <div
      class="bg-primary/20 border-primary/30 absolute -right-2 -bottom-2 flex size-7 items-center justify-center rounded-lg border">
      <TargetIcon class="text-primary size-3.5" />
    </div>
  </div>
  <h2 class="text-foreground mt-6 text-center text-4xl font-black tracking-tight uppercase">
    Track Your Trophy Progress
  </h2>
  <p class="text-muted-foreground text-center leading-relaxed">
    Enter your PSN ID to start tracking your profile completion!
  </p>
  <div
    class="bg-card/50 border-border mt-6 flex items-center gap-3 justify-self-center rounded border p-4">
    <AlertTriangleIcon class="text-chart-5 mt-0.5 size-4 shrink-0" />
    <p class="text-muted-foreground text-sm leading-relaxed">
      Just make sure your PSN profile is set to public so your trophy data can be accessed!
    </p>
  </div>
</template>
