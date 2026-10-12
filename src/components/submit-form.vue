<script setup lang="ts">
import FetchModal from "@/components/fetch-modal.vue";
import { useAbortController } from "@/hooks/use-abort-controller";
import { useCompletionStore } from "@/store/completion";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/input-group";
import { API } from "@/utils/api";
import { showExpiresToast } from "@/utils/toast";
import { TrophyScoutError } from "@hartaithan/trophy-scout";
import type { CompletionProgressData } from "@hartaithan/trophy-scout/types";
import { SendHorizontal, XIcon } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

interface Elements extends HTMLFormControlsCollection {
  id: { value: string };
}

interface From extends HTMLFormElement {
  elements: Elements;
}

const messages = {
  empty: "Enter your PSN ID. This field cannot be empty",
  fetch: "Unable to fetch profile",
};

const store = useCompletionStore();
const hasValue = ref<boolean>(false);
const form = ref<From | null>(null);
const { abort, getSignal } = useAbortController();

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  hasValue.value = target.value.trim().length > 0;
};

const clear = () => {
  hasValue.value = false;
  if (!form.value) return;
  const elements = form.value.elements;
  elements.id.value = "";
};

const onProgress = (data: CompletionProgressData) => {
  const current = data?.current || 0;
  const total = data?.total || 0;
  store.setProgress({ current, total });
};

const handleSubmit: (event: SubmitEvent) => void = async (event) => {
  const { elements } = event.target as From;
  const id = elements?.id.value.trim();

  if (id.length === 0) {
    toast.error(messages.empty);
    return;
  }

  const flow = API.flow("fetch", { psn_id: id, data: "completion", trigger: "form" });
  const signal = getSignal();

  try {
    store.setStatus("profile-loading");
    const { profile } = await API.getProfile({ id, signal, flow });
    if (!profile) throw new TrophyScoutError(messages.fetch);
    store.setProfile(profile);

    store.setStatus("completion-loading");
    const { list, progress, expires } = await API.getCompletion({
      id,
      onProgress,
      signal,
      flow,
    });
    store.setCompletion(list || [], "completed");
    store.setCalculated(progress);
    showExpiresToast(expires);

    flow.complete({
      completion_percent: progress.value,
      earned_count: progress.earned,
      total_count: progress.total,
      game_count: list?.length ?? 0,
    });
    clear();
  } catch (error) {
    store.setStatus("idle");
    if (flow.fail(error) === "failed") {
      toast.error(API.getErrorMessage(error));
    }
  }
};
</script>

<template>
  <form class="w-full" ref="form" @submit.prevent="handleSubmit">
    <InputGroup>
      <InputGroupInput
        name="id"
        @input="onInput"
        class="text-sm sm:text-base"
        placeholder="Enter your PSN ID"
        spellcheck="false"
        autocorrect="off" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          v-if="hasValue"
          @click="clear"
          size="icon-xs"
          type="button"
          aria-label="Clear the input">
          <XIcon />
        </InputGroupButton>
        <InputGroupButton
          size="icon-xs"
          type="submit"
          aria-label="Submit the PSN ID to fetch the profile">
          <SendHorizontal />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </form>
  <FetchModal :abort="abort" />
</template>
