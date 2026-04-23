<script setup lang="ts">
import { platformOptions } from "@/constants/options";
import { useCompletionStore } from "@/store/completion";
import MultiSelect from "@/ui/multi-select/MultiSelect.vue";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import Skeleton from "@/ui/skeleton/Skeleton.vue";
import { getSorter } from "@/utils/sorter";
import type { AcceptableValue } from "reka-ui";

const completion = useCompletionStore();

const handleSorter = (value: AcceptableValue) => {
  completion.setSorter(getSorter(value));
};
</script>

<template>
  <div v-if="completion.loading" class="container mt-6">
    <Skeleton class="h-9 w-full" />
  </div>
  <div
    v-if="!completion.loading && completion.completion.length > 0"
    class="container mt-6 grid grid-cols-3 gap-2">
    <Select v-on:update:model-value="handleSorter">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Default sorting" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem :value="null">Default sorting</SelectItem>
        <SelectItem value="progress:asc">Progress: Low → High</SelectItem>
        <SelectItem value="progress:desc">Progress: High → Low</SelectItem>
        <SelectItem value="title:asc">Name: A → Z</SelectItem>
        <SelectItem value="title:desc">Name: Z → A</SelectItem>
      </SelectContent>
    </Select>
    <Select v-model="completion.filters.completion">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="All statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem :value="null">All statuses</SelectItem>
        <SelectItem value="100">100%</SelectItem>
        <SelectItem value="not-100">Not 100%</SelectItem>
        <SelectItem value="not-100-or-platinum">Not 100% or Platinum</SelectItem>
        <SelectItem value="platinum">Platinum</SelectItem>
        <SelectItem value="platinum-not-100">Platinum but not 100%</SelectItem>
      </SelectContent>
    </Select>
    <MultiSelect
      v-model="completion.filters.platforms"
      :options="platformOptions"
      placeholder="Select platforms..." />
  </div>
</template>
