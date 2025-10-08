<script setup lang="ts">
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/input-group";
import { SendHorizonal } from "lucide-vue-next";

interface Elements extends HTMLFormControlsCollection {
  id: { value: string };
}

interface From extends HTMLFormElement {
  elements: Elements;
}

const handleSubmit: (event: SubmitEvent) => void = (event) => {
  const { elements } = event.target as From;
  const id = elements?.id.value.trim();
  console.info("id", id);
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
