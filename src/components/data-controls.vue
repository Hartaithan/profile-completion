<script setup lang="ts">
import type { Completion } from "@/models/completion";
import type { SortDirection, Sorter } from "@/models/filters";
import { useCompletionStore } from "@/store/completion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import Skeleton from "@/ui/skeleton/Skeleton.vue";
import type { AcceptableValue } from "reka-ui";

const completion = useCompletionStore();

const handleSorter = (value: AcceptableValue) => {
  if (typeof value !== "string") return;
  const [field, direction] = value.split(":") as [keyof Completion, SortDirection];
  let next: Sorter | null = { field, direction };
  if (value === "null") next = null;
  completion.setSorter(next);
};
</script>

<template>
  <div v-if="completion.loading" class="container mt-6">
    <Skeleton class="h-9 w-full" />
  </div>
  <div
    v-if="!completion.loading && completion.completion.length"
    class="container mt-6 flex gap-x-2">
    <Select v-on:update:model-value="handleSorter">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Default sorting" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="null">Default sorting</SelectItem>
        <SelectItem value="progress:asc">Progress: Low → High</SelectItem>
        <SelectItem value="progress:desc">Progress: High → Low</SelectItem>
        <SelectItem value="title:asc">Name: A → Z</SelectItem>
        <SelectItem value="title:desc">Name: Z → A</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
