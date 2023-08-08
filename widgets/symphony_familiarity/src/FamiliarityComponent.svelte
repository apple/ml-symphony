<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import { ResolverType, SymphonySpec, TooltipSpec } from '@apple/symphony-lib';
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Writable } from 'svelte/store';

  import { SymphonyVegaLite, Pagination } from '@apple/symphony-lib';
  import { desc } from 'arquero';

  export let table: ColumnTable;
  export let filteredTable: ColumnTable;
  export let groupedTables: ColumnTable[];
  export let groupNames: Writable<string[][]>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let selected: Writable<string[]>;
  export let tooltip: Writable<TooltipSpec>;
  export let selectedColumn: string;
  export let sortDescending: boolean;

  let container: HTMLDivElement;

  $: sortTables(sortDescending, $groupNames, filteredTable, groupedTables);
  $: histogramSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: `${selectedColumn} binned`,
    data: { values: 'values' },
    mark: { type: 'bar', tooltip: true },
    encoding: {
      x: {
        field: 'bin_0',
        title: 'score',
      },
      y: { field: 'count', type: 'quantitative', title: 'instances' },
    },
  };
  $: filteredStatistics = filteredTable.rollup({
    mean: `d => op.mean(d.${selectedColumn})`,
    std: `d => op.stdev(d.${selectedColumn})`,
  });
  $: groupedStatistics = groupedTables.map((table) => {
    return table.rollup({
      mean: `d => op.mean(d.${selectedColumn})`,
      std: `d => op.stdev(d.${selectedColumn})`,
    });
  });

  function sortTables(
    sortDescending: boolean,
    groupNames: string[][],
    table: ColumnTable,
    tables: ColumnTable[]
  ) {
    if (groupNames.length === 0) {
      filteredTable = table.orderby(
        sortDescending ? desc(selectedColumn) : selectedColumn
      );
    } else {
      groupedTables = [
        ...tables.map((table) =>
          table.orderby(sortDescending ? desc(selectedColumn) : selectedColumn)
        ),
      ];
    }
  }
</script>

<div class="flex justify-between overflow-hidden flex-grow">
  <div class="flex flex-col overflow-hidden flex-1">
    <div class="flex overflow-hidden" bind:this={container}>
      {#if $groupNames.length === 0}
        <Pagination
          title="{sortDescending ? 'Most' : 'Least'} Familiar Instances"
          {filteredTable}
          {selected}
          {tooltip}
          {symphonySpec}
        >
          <div class="flex flex-col items-center" slot="extra">
            <SymphonyVegaLite
              showUnfilteredData={$symphonySpec.showUnfilteredData}
              spec={histogramSpec}
              data={{ values: 'arrow_table' }}
              resolver={{
                columnName: selectedColumn,
                type: ResolverType.NUMBER,
              }}
              {table}
              {filteredTable}
            />
            <p class="text-xs text-darkgrey">
              {#if filteredStatistics.column('mean').get(0) !== undefined}
              Mean: {filteredStatistics.column('mean').get(0).toFixed(2)}
              , STD: {filteredStatistics.column('std').get(0).toFixed(2)}
              {/if}
            </p>
          </div>
        </Pagination>
      {:else}
        <div class="flex flex-wrap overflow-auto w-full">
          {#each groupedTables as groupTable, i}
            {#if groupTable.size !== 0}
              <div class="flex flex-col pb-2 overflow-hidden flex-grow">
                <Pagination
                  title={$groupNames[i].join(' | ')}
                  filteredTable={groupTable}
                  {selected}
                  {tooltip}
                  {symphonySpec}
                >
                  <div class="flex flex-col items-center" slot="extra">
                    <SymphonyVegaLite
                      showUnfilteredData={$symphonySpec.showUnfilteredData}
                      spec={histogramSpec}
                      data={{ values: 'arrow_table' }}
                      resolver={{
                        columnName: selectedColumn,
                        type: ResolverType.NUMBER,
                      }}
                      {table}
                      filteredTable={groupTable}
                    />
                    <p class="text-xs text-darkgrey">
                      {#if groupedStatistics[i].column('mean').get(0) !== undefined}
                      Mean: {groupedStatistics[i].column('mean').get(0).toFixed(2)}
                      , STD: {groupedStatistics[i].column('std').get(0).toFixed(2)}
                      {/if}
                    </p>
                  </div>
                </Pagination>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
