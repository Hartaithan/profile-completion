<script setup lang="ts">
import FetchModal from "@/components/fetch-modal.vue";
import { useAbortController } from "@/hooks/use-abort-controller";
import type { CompletionProgressData } from "@/models/completion";
import { useCompletionStore } from "@/store/completion";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/input-group";
import { API } from "@/utils/api";
import { readError } from "@/utils/error";
import { showExpiresToast } from "@/utils/toast";
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
  cancel: "Data download was canceled by the user",
  fetch: "Unable to fetch profile",
};

const store = useCompletionStore();
const hasValue = ref<boolean>(false);
const form = ref<From | null>(null);
const { abort, getSignal } = useAbortController({ message: messages.cancel });

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
  let expires: string | undefined;

  try {
    if (id.length === 0) throw new Error(messages.empty);
    store.setStatus("profile-loading");

    const { profile, expires: profileExpires } = await API.getProfile({ id, signal: getSignal() });
    if (!profile) throw new Error(messages.fetch);
    store.setProfile(profile);
    expires = profileExpires;

    store.setStatus("completion-loading");
    const { list, expires: completionExpires } = await API.getCompletion({
      id,
      onProgress,
      signal: getSignal(),
    });
    expires = completionExpires;
    store.setCompletion(list || [], "completed");
    showExpiresToast(expires);
  } catch (error) {
    const message = readError(error);
    toast.error(message);
    console.info("error", message, error);
    store.setStatus("idle");
  }
};
</script>

<template>
  <form class="w-full" ref="form" @submit.prevent="handleSubmit">
    <InputGroup>
      <InputGroupInput name="id" @input="onInput" placeholder="Enter your PSN ID" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton v-if="hasValue" @click="clear" size="icon-xs" type="button">
          <XIcon />
        </InputGroupButton>
        <InputGroupButton size="icon-xs" type="submit">
          <SendHorizontal />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </form>
  <FetchModal :abort="abort" />
</template>
