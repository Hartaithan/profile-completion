<script setup lang="ts">
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/input-group";
import { API } from "@/utils/api";
import { SendHorizonal } from "lucide-vue-next";
import { useCompletionStore } from "../store/completion";

interface Elements extends HTMLFormControlsCollection {
  id: { value: string };
}

interface From extends HTMLFormElement {
  elements: Elements;
}

const errors = {
  empty: "Enter your PSN ID. This field cannot be empty",
  fetch: "Unable to fetch profile",
};

const { setStatus, setProfile, setCompletion } = useCompletionStore();

const handleSubmit: (event: SubmitEvent) => void = async (event) => {
  const { elements } = event.target as From;
  const id = elements?.id.value.trim();

  try {
    if (id.length === 0) throw new Error(errors.empty);
    setStatus("profile-loading");

    const { profile } = await API.getProfile({ id });
    if (!profile) throw new Error(errors.fetch);
    setProfile(profile);

    const { completion } = await API.getCompletion({ id });
    setCompletion(completion || []);
    setStatus("completed");
  } catch (error) {
    console.error("submit error", error);
    setStatus("idle");
  }
};
</script>

<template>
  <form class="container" @submit.prevent="handleSubmit">
    <InputGroup>
      <InputGroupInput name="id" placeholder="Enter your PSN ID" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" type="submit">
          <SendHorizonal />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </form>
</template>
