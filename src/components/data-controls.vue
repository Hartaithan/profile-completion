<script setup lang="ts">
import { platformOptions } from "@/constants/platform";
import { useCompletionStore } from "@/store/completion";
import { MultiSelect } from "@/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Skeleton } from "@/ui/skeleton";
import { makeFilter, makeSorter } from "@/utils/data-transform";

const completion = useCompletionStore();

const sorter = makeSorter(completion, "sorter", completion.setSorter);
const filterCompletion = makeFilter(completion.filters, "completion", completion.setFilter);
const filterPlatforms = makeFilter(completion.filters, "platforms", completion.setFilter);
</script>

<template>
  <div v-if="completion.loading" class="container mt-6">
    <Skeleton class="h-9 w-full" />
  </div>
  <div
    v-if="!completion.loading && completion.completion.length > 0"
    class="container mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
    <Select v-model="sorter">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Default sorting" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem :value="null">Default sorting</SelectItem>
        <SelectItem value="progress.value:asc">Progress: Low → High</SelectItem>
        <SelectItem value="progress.value:desc">Progress: High → Low</SelectItem>
        <SelectItem value="title:asc">Name: A → Z</SelectItem>
        <SelectItem value="title:desc">Name: Z → A</SelectItem>
        <SelectItem value="counts.total:asc">Total Trophies: Low → High</SelectItem>
        <SelectItem value="counts.total:desc">Total Trophies: High → Low</SelectItem>
      </SelectContent>
    </Select>
    <Select v-model="filterCompletion">
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
      class="col-span-1 sm:col-span-2 md:col-span-1"
      v-model="filterPlatforms"
      :options="platformOptions"
      placeholder="Select platforms..." />
  </div>
</template>
