<script setup lang="ts">
import { useCompletionStore } from "@/store/completion";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "@/ui/dialog";
import { Progress } from "@/ui/progress";
import { getProgressResult } from "@/utils/fetch-progress";
import { Check, Gamepad2, RefreshCw, User } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import FetchStep from "./fetch-step.vue";

const orders: Record<string, number> = {
  idle: 0,
  "profile-loading": 1,
  "completion-loading": 2,
  completed: 3,
};

const store = useCompletionStore();
const { status, progress } = storeToRefs(store);
const { setStatus } = store;

const result = computed(() => getProgressResult(progress.value.current, progress.value.total));

const handleContinue = () => setStatus("idle");
</script>

<template>
  <Dialog :open="status !== 'idle'">
    <DialogOverlay class="bg-popover/80 fixed inset-0 backdrop-blur" />
    <DialogContent class="bg-popover/50 gap-0 rounded p-4 sm:max-w-xl" :show-close-button="false">
      <DialogTitle class="sr-only">Sync Modal</DialogTitle>
      <DialogDescription class="sr-only">Sync Modal Description</DialogDescription>
      <div class="flex items-center justify-between">
        <div class="flex flex-col uppercase">
          <h2 class="text-primary text-xl font-black tracking-tighter">Loading Your Data</h2>
          <p class="text-muted-foreground font-mono">Preparing profile and game library</p>
        </div>
        <div
          class="border-primary/80 bg-primary/10 flex size-12 items-center justify-center rounded border">
          <RefreshCw class="text-primary animate-spin-slow size-5" />
        </div>
      </div>
      <div class="bg-border my-5 h-px w-full" />
      <div class="space-y-4 px-2">
        <FetchStep
          title="Profile"
          :icon="User"
          :active="status === 'profile-loading'"
          :completed="(orders?.[status] ?? 0) > 1">
          <template #status>
            <template v-if="(orders?.[status] ?? 0) > 1">COMPLETED</template>
            <template v-else-if="status === 'profile-loading'">LOADING</template>
            <template v-else>WAITING</template>
          </template>
        </FetchStep>
        <FetchStep
          title="Games"
          :icon="Gamepad2"
          :active="status === 'completion-loading'"
          :completed="(orders?.[status] ?? 0) > 2">
          <template #status>
            <template v-if="(orders?.[status] ?? 0) > 2">COMPLETED</template>
            <template v-else-if="status === 'completion-loading'">{{ result.label }}</template>
            <template v-else>WAITING</template>
          </template>
          <Progress class="h-1.5" :model-value="result.value" />
        </FetchStep>
        <FetchStep
          title="Success"
          :icon="Check"
          :active="status === 'completed'"
          :completed="(orders?.[status] ?? 0) >= 3">
          <template #status>
            <template v-if="(orders?.[status] ?? 0) >= 3">COMPLETED</template>
            <template v-else-if="status === 'completed'">LOADING</template>
            <template v-else>WAITING</template>
          </template>
        </FetchStep>
      </div>
      <div class="bg-border my-5 h-px w-full" />
      <div class="relative flex h-9 items-center justify-between gap-5">
        <div class="flex flex-col gap-0.5 font-mono">
          <span class="text-muted-foreground/40 text-xxs uppercase">SYSTEM_STATUS</span>
          <span class="text-primary/40 text-xxs font-medium">STABLE // 12.4ms</span>
        </div>
        <Button
          :class="[
            'absolute top-1/2 right-1/2 w-32 translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300',
            status === 'completed' ? 'opacity-100' : 'opacity-0',
          ]"
          size="sm"
          @click="handleContinue">
          Continue
        </Button>
        <div class="bg-muted relative h-4 w-32 overflow-hidden rounded-sm">
          <div class="absolute inset-0 flex items-end gap-px px-1">
            <div class="bg-primary/20 h-[40%] w-full" />
            <div class="bg-primary/20 h-[60%] w-full" />
            <div class="bg-primary/40 h-[80%] w-full" />
            <div class="bg-primary/20 h-[30%] w-full" />
            <div class="bg-primary/20 h-[50%] w-full" />
            <div class="bg-primary/20 h-[70%] w-full" />
            <div class="bg-primary/30 h-[90%] w-full" />
            <div class="bg-primary/20 h-[40%] w-full" />
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
