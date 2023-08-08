<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type {
    SummaryElement,
    ChartData,
    SymphonySpec,
  } from '@apple/symphony-lib';

  import { SymphonyVegaLite, TextField } from '@apple/symphony-lib';
  import { createEventDispatcher } from 'svelte';

  export let symphonySpec: SymphonySpec;
  export let element: SummaryElement;
  export let table: ColumnTable;
  export let filteredTable: ColumnTable;
  export let editMode: boolean = false;

  let value = '';
  const dispatch = createEventDispatcher();

  $: typedData = element.data as ChartData;
  $: title = typedData.spec.title === undefined ? '' : typedData.spec.title;
  $: value = title as string;
  $: {
    if (value !== typedData.spec.title) {
      dispatch('update', {
        element: {
          ...element,
          data: { ...typedData, spec: { ...typedData.spec, title: value } },
        },
        oldElement: element,
      });
    }
  }
</script>

<div
  class="{editMode
    ? 'border border-button_outline'
    : ''} rounded m-1 flex flex-col"
>
  {#if editMode}
    <div class="flex m-1">
      <div class="flex-grow">
        <TextField bind:value placeholder="Chart Title" />
      </div>
    </div>
  {/if}
  <SymphonyVegaLite
    data={typedData.data}
    spec={typedData.spec}
    resolver={typedData.resolver}
    {table}
    {filteredTable}
    showUnfilteredData={symphonySpec.showUnfilteredData}
  />
</div>
