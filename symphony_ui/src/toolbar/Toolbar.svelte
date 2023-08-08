<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Readable, Writable } from 'svelte/store';
  import type { SymphonySpec, TooltipSpec } from '@apple/symphony-lib';

  import FilterBar from './FilterBar.svelte';
  import SelectedItems from './SelectedItems.svelte';
  import Settings from './Settings.svelte';
  import Grouping from './Grouping.svelte';

  export let notebook: boolean = false;
  export let filter: Writable<string>;
  export let filterError: Writable<string>;
  export let table: Readable<ColumnTable>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let groupColumns: Writable<string[]>;
  export let groupNames: Writable<string[][]>;
  export let groupedTables: Readable<ColumnTable[]>;
  export let selected: Writable<string[]>;
  export let tooltip: Writable<TooltipSpec>;
</script>

<div
  class="flex flex-col h-full bg-lightgrey "
  style="width: {notebook ? '35rem' : '25rem'}; 
        max-width: {notebook ? '35rem' : '25rem'};
        "
>
  <div class="p-2 overflow-y-auto h-full">
    <Settings {symphonySpec} />
    <FilterBar {filter} {filterError} {table} />
    <Grouping {table} {groupColumns} {groupNames} {groupedTables} {filter} />
    <SelectedItems {table} {symphonySpec} {selected} {tooltip} />
  </div>
</div>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
