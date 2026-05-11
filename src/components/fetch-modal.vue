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
    <DialogContent
      class="bg-popover/80 gap-0 rounded p-3 sm:max-w-xl sm:p-4"
      :show-close-button="false">
      <DialogTitle class="sr-only">Sync Modal</DialogTitle>
      <DialogDescription class="sr-only">Sync Modal Description</DialogDescription>
      <div class="flex items-center justify-between gap-3">
        <div class="flex flex-col uppercase">
          <h2 class="text-primary text-xl font-black tracking-tighter sm:text-2xl">
            {{ status === "completed" ? "Your Data is Ready" : "Loading Your\u00A0Data..." }}
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
          class="border-primary/80 bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded border sm:size-12">
          <CheckCheck v-if="status === 'completed'" class="text-primary size-5 sm:size-6" />
          <RefreshCw v-else class="text-primary animate-spin-slow size-4 sm:size-5" />
        </div>
      </div>
      <div class="bg-border my-4 h-px w-full sm:my-5" />
      <div class="space-y-3 sm:space-y-4 sm:px-2">
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
      <div class="bg-border my-4 h-px w-full sm:my-5" />
      <div
        class="flex flex-col gap-3 sm:relative sm:h-9 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div class="flex flex-col gap-0.5 font-mono">
          <span class="text-muted-foreground/40 text-xxs uppercase">SYSTEM_STATUS</span>
          <span class="text-primary/40 text-xxs font-medium">STABLE // 12.4ms</span>
        </div>
        <Transition name="fade" mode="out-in">
          <Button
            v-if="status === 'completed'"
            key="continue"
            class="h-7 w-full rounded text-xs font-bold uppercase sm:absolute sm:top-1/2 sm:right-1/2 sm:h-8 sm:w-32 sm:translate-x-1/2 sm:-translate-y-1/2"
            size="sm"
            @click="handleContinue"
            aria-label="Close modal">
            Continue
          </Button>
          <Button
            v-else
            key="cancel"
            class="h-7 w-full rounded text-xs font-bold uppercase sm:absolute sm:top-1/2 sm:right-1/2 sm:h-8 sm:w-32 sm:translate-x-1/2 sm:-translate-y-1/2"
            size="sm"
            @click="handleCancel"
            aria-label="Cancel the data fetching">
            Cancel
          </Button>
        </Transition>
        <div class="bg-muted relative hidden h-4 overflow-hidden rounded-sm sm:block sm:w-32">
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
