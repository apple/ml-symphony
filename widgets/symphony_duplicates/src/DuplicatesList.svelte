<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { SymphonySpec, TooltipSpec } from '@apple/symphony-lib';
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Writable } from 'svelte/store';

  import { PaginationControls } from '@apple/symphony-lib';
  import DatasetDuplicatesList from './DatasetDuplicatesList.svelte';

  export let selectedColumn: string;
  export let filteredTable: Writable<ColumnTable>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let groupColumns: Writable<string[]>;
  export let groupNames: Writable<string[][]>;
  export let selected: Writable<string[]>;
  export let tooltip: Writable<TooltipSpec>;

  const NUMBER_SHOWN = 17;
  $: rowsPerPage = Math.ceil(
    Math.max($symphonySpec.instancesPerPage / NUMBER_SHOWN, 5)
  );

  let groupedDuplicates: Record<string, Record<string, unknown>[]> = {};
  let groupKeys: string[] = [];
  let page = 0;

  filteredTable.subscribe(() => (page = 0));
  groupColumns.subscribe(() => (page = 0));

  $: duplicateRows = $filteredTable
    .filter(`(d) => d["${selectedColumn}"] !== -1`)
    .objects();
  $: {
    groupedDuplicates = {};
    duplicateRows.forEach((row) => {
      const group: number = row[selectedColumn];
      if (groupedDuplicates[group] === undefined) {
        groupedDuplicates[group] = [];
      }
      groupedDuplicates[group].push(row);
    });
    groupKeys = Object.keys(groupedDuplicates);
    groupKeys.sort(
      (a, b) => groupedDuplicates[b].length - groupedDuplicates[a].length
    );
  }
</script>

<div
  class="flex flex-col relative items-start border-b border-midgrey pb-1 mb-1 overflow-auto flex-1"
>
  {#each groupKeys.slice(page * rowsPerPage + 1, page * rowsPerPage + rowsPerPage) as group, i}
    {#if groupedDuplicates[group] !== undefined}
      <div class="py-1 w-full">
        <DatasetDuplicatesList
          slot="content"
          dataPoints={groupedDuplicates[group]}
          defaultNumberShown={NUMBER_SHOWN}
          {groupColumns}
          {groupNames}
          {symphonySpec}
          {selected}
          {tooltip}
          candidatesGroupNumber={i}
        />
      </div>
    {/if}
  {/each}
</div>
<PaginationControls
  bind:page
  instancesPerPage={rowsPerPage}
  size={groupKeys.length}
/>
