<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Readable, Writable } from 'svelte/store';

  import Fa from 'svelte-fa';
  import { faLayerGroup } from '@fortawesome/free-solid-svg-icons/faLayerGroup';
  import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
  import { fade } from 'svelte/transition';

  import {
    SubHeading,
    IconButton,
    GroupChip,
    MultiSelect,
    getBinnableStringColumns,
  } from '@apple/symphony-lib';

  export let table: Readable<ColumnTable>;
  export let groupColumns: Writable<string[]>;
  export let groupNames: Writable<string[][]>;
  export let groupedTables: Readable<ColumnTable[]>;
  export let filter: Writable<string>;

  let value: string[] = $groupColumns;
  let items = getBinnableStringColumns($table);

  table.subscribe(table => items = getBinnableStringColumns(table))

  function handleClear(event?: CustomEvent) {
    if (event) {
      groupColumns.update((cols) =>
        cols.filter((d) => d !== event.detail.value)
      );
    } else {
      groupColumns.set([]);
      value = [];
    }
  }

  function handleRemove(event: CustomEvent) {
    let addedFilter = '(';
    for (const [i, value] of event.detail.values.entries()) {
      if (i !== 0) {
        addedFilter = addedFilter + ' || ';
      }
      addedFilter = addedFilter + `d.${$groupColumns[i]} != '${value}'`;
    }
    addedFilter = addedFilter + ')';
    if ($filter === '') {
      filter.set(addedFilter);
    } else {
      filter.set($filter + ' && ' + addedFilter);
    }
  }
</script>

<div class="flex flex-col p-2 flex-grow">
  <div>
    <SubHeading heading={'Group'} />
  </div>
  <div class="mt-1 toolbar-select">
    <MultiSelect
      placeholder="Select columns to group by"
      {items}
      {value}
      on:select={(ev) => (value = ev.detail)}
      on:clear={() => handleClear()}
    />
  </div>
  <div class="pt-2 flex justify-end">
    {#if $groupColumns.length !== 0}
      <div class="pr-2" transition:fade>
        <IconButton on:click={() => handleClear()}>
          <Fa icon={faTimes} slot="icon" />
          <span slot="text">Clear</span>
        </IconButton>
      </div>
    {/if}
    <IconButton
      on:click={() => {
        groupColumns.set(value.map((d) => d.value));
      }}
    >
      <Fa icon={faLayerGroup} slot="icon" />
      <span slot="text">Group</span>
    </IconButton>
  </div>
  {#if $groupNames.length > 0}
    <div class="flex flex-row flex-wrap overflow-auto mt-2">
      {#each $groupNames as col, i}
        {#if $groupedTables[i].size > 0}
          <GroupChip
            groupSize={$groupedTables[i].size}
            values={col}
            on:remove={handleRemove}
          />
        {/if}
      {/each}
    </div>
  {/if}
</div>
