<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type {
    WidgetSpec,
    SymphonySpec,
    TooltipSpec,
  } from '@apple/symphony-lib';
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Writable } from 'svelte/store';

  import DuplicatesList from './DuplicatesList.svelte';
  import { mapHeight, Dropdown, ComponentHeader } from '@apple/symphony-lib';

  export let widgetSpec: WidgetSpec;
  export let fullSize: boolean = false;
  export let filteredTable: Writable<ColumnTable>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let groupColumns: Writable<string[]>;
  export let groupNames: Writable<string[][]>;
  export let selected: Writable<string[]>;
  export let tooltip: Writable<TooltipSpec>;

  let selectedLayer: string;
  let container: HTMLDivElement;

  $: columnNames = $filteredTable.columnNames((d) =>
    d.startsWith('duplicates_')
  );
  $: layerNames = columnNames.map((name) => name.substring(11));
  $: if (selectedLayer === undefined)
    selectedLayer = layerNames[0] !== undefined ? layerNames[0] : '';
  $: selectedColumn =
    selectedLayer === undefined
      ? ''
      : columnNames.find((name) => name.includes(selectedLayer));
</script>

<div
  class="flex flex-col overflow-hidden p-2 {fullSize
    ? 'h-full'
    : mapHeight(widgetSpec.height)}"
>
  <ComponentHeader
    title={'Duplicates'}
    description={widgetSpec.description}
    {container}
  >
    {#if layerNames.length > 1}
      <div class="mr-4 flex flex-row mb-2 items-center">
        <p class="mr-2">Layer:</p>
        <Dropdown bind:value={selectedLayer} items={layerNames} />
      </div>
    {/if}
  </ComponentHeader>
  <div bind:this={container} class="flex flex-col min-h-0 flex-1">
    {#if layerNames[0] !== undefined}
      {#if selectedColumn !== ''}
        <DuplicatesList
          {selectedColumn}
          {filteredTable}
          {symphonySpec}
          {groupColumns}
          {groupNames}
          {selected}
          {tooltip}
        />
      {/if}
    {:else}
      <p>
        No duplicate columns found. A duplicate column must start with
        'duplicates_'
      </p>
    {/if}
  </div>
</div>
