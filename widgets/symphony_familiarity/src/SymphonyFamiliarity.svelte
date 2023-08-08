<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import {
    WidgetSpec,
    SymphonySpec,
    TooltipSpec,
    getColumnType,
  } from '@apple/symphony-lib';
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Writable } from 'svelte/store';

  import Fa from 'svelte-fa';
  import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons/faSortAmountDown';
  import { faSortAmountUp } from '@fortawesome/free-solid-svg-icons/faSortAmountUp';

  import FamiliarityComponent from './FamiliarityComponent.svelte';

  import {
    mapHeight,
    IconButton,
    Dropdown,
    ToggleButton,
    ComponentHeader,
  } from '@apple/symphony-lib';
  import {
    getSplitTable,
    getSplitTables,
    getUniqueValuesForStringColumnForFamiliarity,
  } from './splitting';

  export let widgetSpec: WidgetSpec;
  export let fullSize: boolean = false;
  export let table: Writable<ColumnTable>;
  export let filteredTable: Writable<ColumnTable>;
  export let groupedTables: Writable<ColumnTable[]>;
  export let groupNames: Writable<string[][]>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let selected: Writable<string[]>;
  export let tooltip: Writable<TooltipSpec>;

  let container: HTMLDivElement;
  let selectedLayer: string;
  let selectedSplit: string;
  let selectedSplitValue: string;
  let split = false;
  let sortDescending = false;
  let splitColumnNames: string[] = [];

  // Get the column table based on which we look at familiarity
  $: columnNames = $filteredTable.columnNames((d) =>
    d.startsWith('familiarity_')
  );
  $: layerNames = columnNames.map((name) => name.substring(12));
  $: {
    if (selectedLayer === undefined)
      selectedLayer = layerNames[0] === undefined ? '' : layerNames[0];
  }
  $: selectedColumn =
    selectedLayer === undefined
      ? ''
      : columnNames.find((name) => name.includes(selectedLayer))!;
  // If familiarity can also be looked at split by some column (e.g. label), get the column and value to display here.
  $: if (selectedLayer !== undefined) {
    splitColumnNames = $filteredTable.columnNames(
      (d) => d.startsWith('splitFamiliarity') && d.includes(selectedLayer)
    );
  }
  $: splitColumns = splitColumnNames.map(
    (columnName) => columnName.split('_byAttr_')[1]
  );
  $: if (selectedSplit === undefined) {
    selectedSplit =
      splitColumns !== undefined && splitColumns.length > 0
        ? splitColumns[0]
        : '';
  }
  $: selectedSplitColumn = splitColumnNames.find((d) =>
    d.includes(`_byAttr_${selectedSplit}`)
  );
  $: splitValues =
    selectedSplit !== '' && getColumnType($table, selectedSplit) === 'string'
      ? getUniqueValuesForStringColumnForFamiliarity(split, selectedSplitColumn!, selectedSplit, $table)
      : [];
  $: if (selectedSplitValue === undefined) {
    selectedSplitValue =
      splitColumns !== undefined && splitColumns.length > 0
        ? splitValues[0]
        : '';
  }
  // Get subsets of the original tables if we are looking at familiarity calculated split by a column.
  $: splitTables =
    split && selectedSplitValue !== undefined && selectedSplitValue !== '';
  $: splitTable = splitTables
    ? getSplitTable(
        selectedSplitValue,
        selectedSplitColumn!,
        selectedSplit,
        $table
      )
    : $table;
  $: splitFilteredTable = splitTables
    ? getSplitTable(
        selectedSplitValue,
        selectedSplitColumn!,
        selectedSplit,
        $filteredTable
      )
    : $filteredTable;
  $: splitGroupedTables = splitTables
    ? getSplitTables(
        selectedSplitValue,
        selectedSplitColumn!,
        selectedSplit,
        $groupedTables
      )
    : $groupedTables;
  $: familiarityColumn =
    split && splitTable.column('selectedFamiliarity') !== undefined
      ? 'selectedFamiliarity'
      : selectedColumn;
</script>

<div
  class="flex flex-col p-2 {fullSize ? 'h-full' : mapHeight(widgetSpec.height)}"
>
  <ComponentHeader
    title={'Familiarity'}
    description={widgetSpec.description}
    {container}
  >
    {#if columnNames.length > 1}
      <div class="mr-4 flex flex-row mb-2 items-center">
        <p class="mr-2">Layer:</p>
        <Dropdown items={layerNames} bind:value={selectedLayer} />
      </div>
    {/if}
    {#if splitColumnNames.length > 0}
      <div class="mr-4 mt-2">
        <ToggleButton bind:active={split} title="By Attribute" />
      </div>
    {/if}
  </ComponentHeader>
  <div class="flex items-center pb-3">
    {#if split}
      <span class="pr-1">By Column:</span>
      <div class="pr-2">
        <Dropdown items={splitColumns} bind:value={selectedSplit} />
      </div>
      <span class="pr-1">Value:</span>
      <div class="pr-2">
        <Dropdown items={splitValues} bind:value={selectedSplitValue} />
      </div>
    {/if}
    <IconButton
      on:click={() => {
        sortDescending = !sortDescending;
        container.scrollTop = 0;
      }}
    >
      <Fa
        icon={sortDescending ? faSortAmountDown : faSortAmountUp}
        slot="icon"
      />
      <span slot="text"
        >{sortDescending
          ? 'Familiar to Unfamiliar'
          : 'Unfamiliar to Familiar'}</span
      >
    </IconButton>
  </div>
  {#if layerNames[0] !== undefined}
    {#if selectedColumn !== ''}
      <div bind:this={container} class="overflow-auto">
        <FamiliarityComponent
          table={splitTable}
          filteredTable={splitFilteredTable}
          groupedTables={splitGroupedTables}
          {groupNames}
          {symphonySpec}
          {selected}
          {tooltip}
          selectedColumn={familiarityColumn}
          {sortDescending}
        />
      </div>
    {/if}
  {:else}
    <p>
      No familiarity columns found. A familiarity column must start with
      'familiarity_'
    </p>
  {/if}
</div>
