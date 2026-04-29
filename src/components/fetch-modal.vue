<script setup lang="ts">
import FetchStep from "@/components/fetch-step.vue";
import type { AbortHandler } from "@/hooks/use-abort-controller";
import type { FetchStatus } from "@/models/app";
import { useCompletionStore } from "@/store/completion";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "@/ui/dialog";
import { Progress } from "@/ui/progress";
import { getProgressResult } from "@/utils/fetch-progress";
import { Check, CheckCheck, Gamepad2, RefreshCw, User } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed } from "vue";

interface Props {
  abort: AbortHandler;
}

const props = defineProps<Props>();

const orders: Record<FetchStatus, number> = {
  idle: 0,
  initializing: 0,
  "profile-loading": 1,
  "completion-loading": 2,
  completed: 3,
};

const store = useCompletionStore();
const { status, progress } = storeToRefs(store);
const { setStatus } = store;

const result = computed(() => getProgressResult(progress.value.current, progress.value.total));

const handleContinue = () => setStatus("idle");
const handleCancel = () => props.abort("data-loading");
</script>

<template>
  <Dialog :open="status !== 'idle' && status !== 'initializing'">
    <DialogOverlay class="bg-popover/5 fixed inset-0 backdrop-blur" />
    <DialogContent class="bg-popover/80 gap-0 rounded p-4 sm:max-w-xl" :show-close-button="false">
      <DialogTitle class="sr-only">Sync Modal</DialogTitle>
      <DialogDescription class="sr-only">Sync Modal Description</DialogDescription>
      <div class="flex items-center justify-between">
        <div class="flex flex-col uppercase">
          <h2 class="text-primary text-2xl font-black tracking-tighter">
            {{ status === "completed" ? "Your Data is Ready" : "Loading Your Data..." }}
          </h2>
          <p class="text-muted-foreground text-xxs font-mono">
            {{
              status === "completed"
                ? "Profile and game library successfully loaded"
                : "Preparing profile and game library"
            }}
          </p>
        </div>
        <div
          class="border-primary/80 bg-primary/10 flex size-12 items-center justify-center rounded border">
          <CheckCheck v-if="status === 'completed'" class="text-primary size-6" />
          <RefreshCw v-else class="text-primary animate-spin-slow size-5" />
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
        <Transition name="fade" mode="out-in">
          <Button
            v-if="status === 'completed'"
            key="continue"
            class="absolute top-1/2 right-1/2 w-32 translate-x-1/2 -translate-y-1/2 rounded text-xs font-bold uppercase"
            size="sm"
            @click="handleContinue">
            Continue
          </Button>
          <Button
            v-else
            key="cancel"
            class="absolute top-1/2 right-1/2 w-32 translate-x-1/2 -translate-y-1/2 rounded text-xs font-bold uppercase"
            size="sm"
            @click="handleCancel">
            Cancel
          </Button>
        </Transition>
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
