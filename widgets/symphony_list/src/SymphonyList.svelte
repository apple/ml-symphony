<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type {
    WidgetSpec,
    TooltipSpec,
    SymphonySpec,
  } from '@apple/symphony-lib';
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Writable } from 'svelte/store';

  import { mapHeight, Pagination, ComponentHeader } from '@apple/symphony-lib';

  export let widgetSpec: WidgetSpec;
  export let fullSize: boolean = false;
  export let filteredTable: Writable<ColumnTable>;
  export let groupedTables: Writable<ColumnTable[]>;
  export let groupNames: Writable<string[][]>;
  export let selected: Writable<string[]>;
  export let tooltip: Writable<TooltipSpec>;
  export let symphonySpec: Writable<SymphonySpec>;

  let container: HTMLDivElement;
</script>

<div
  class="flex flex-col p-2 {fullSize ? 'h-full' : mapHeight(widgetSpec.height)}"
>
  <ComponentHeader
    title={'List'}
    description={widgetSpec.description}
    {container}
  />
  <div
    class="flex flex-col justify-between overflow-hidden flex-grow"
    bind:this={container}
  >
    {#if $groupNames.length === 0}
      <Pagination
        title="Instance List"
        filteredTable={$filteredTable}
        {selected}
        {tooltip}
        {symphonySpec}
      />
    {:else}
      <div class="flex flex-col overflow-auto">
        {#each $groupedTables as table, i}
          {#if table.size !== 0}
            <div class="mt-2">
              <Pagination
                title={$groupNames[i].join(' | ')}
                filteredTable={table}
                {selected}
                {tooltip}
                {symphonySpec}
              />
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>
