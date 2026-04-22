<script setup lang="ts">
import type { PlatformFilter } from "@/models/filters";
import { useCompletionStore } from "@/store/completion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import Skeleton from "@/ui/skeleton/Skeleton.vue";
import { getSorter } from "@/utils/sorter";
import type { AcceptableValue } from "reka-ui";

const completion = useCompletionStore();

const handleSorter = (value: AcceptableValue) => {
  completion.setSorter(getSorter(value));
};

const handlePlatforms = (value: AcceptableValue) => {
  completion.setFilter("platforms", value ? [value as PlatformFilter] : null);
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
    <Select v-on:update:model-value="handlePlatforms">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="All platforms" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem :value="null">All platforms</SelectItem>
        <SelectItem value="PS5">PS5</SelectItem>
        <SelectItem value="PS4">PS4</SelectItem>
        <SelectItem value="PS3">PS3</SelectItem>
        <SelectItem value="PSVITA">PS Vita</SelectItem>
        <SelectItem value="PSPC">PC</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
