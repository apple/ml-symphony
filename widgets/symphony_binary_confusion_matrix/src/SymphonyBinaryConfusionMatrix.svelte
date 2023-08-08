<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type {
    ClassificationSpec,
    ConfusionMatrixEntry,
  } from '@apple/symphony-lib';
  import type { Readable } from 'svelte/store';

  import { op } from 'arquero';

  import { mapHeight, Dropdown, ComponentHeader } from '@apple/symphony-lib';
  import ConfusionMatrix from './ConfusionMatrix.svelte';

  export let groupNames: Readable<string[][]>;
  export let groupedTables: Readable<ColumnTable[]>;
  export let filteredTable: Readable<ColumnTable>;
  export let widgetSpec: ClassificationSpec;
  export let fullSize: boolean = false;

  let labelColumn = $filteredTable.columnNames()[0];
  let predictionColumn = $filteredTable.columnNames()[0];
  if (widgetSpec.labelColumn) labelColumn = widgetSpec.labelColumn;
  if (widgetSpec.predictionColumn)
    predictionColumn = widgetSpec.predictionColumn;

  let scores: ConfusionMatrixEntry;
  let groupScores: ConfusionMatrixEntry[];
  let container: HTMLDivElement;

  $: {
    scores = $filteredTable
      .derive({
        tp: `d => op.round(d.${labelColumn}) === 1 & op.round(d.${predictionColumn}) === 1`,
        tn: `d => op.round(d.${labelColumn}) === 0 & op.round(d.${predictionColumn}) === 0`,
        fp: `d => op.round(d.${labelColumn}) === 0 & op.round(d.${predictionColumn}) === 1`,
        fn: `d => op.round(d.${labelColumn}) === 1 & op.round(d.${predictionColumn}) === 0`,
        acc: `d => (op.round(d.${labelColumn}) === 1 & op.round(d.${predictionColumn}) === 1) | (op.round(d.${labelColumn}) === 0 & op.round(d.${predictionColumn}) === 0) `,
      })
      .rollup({
        tp: (d) => op.sum(d.tp),
        tn: (d) => op.sum(d.tn),
        fp: (d) => op.sum(d.fp),
        fn: (d) => op.sum(d.fn),
        acc: (d) => op.sum(d.acc),
        size: (_) => op.count(),
      })
      .object() as ConfusionMatrixEntry;
  }
  $: {
    if ($groupNames.length > 0) {
      groupScores = $groupedTables.map(
        (table, i) =>
          table
            .derive({
              tp: `d => op.round(d.${labelColumn}) === 1 & op.round(d.${predictionColumn}) === 1`,
              tn: `d => op.round(d.${labelColumn}) === 0 & op.round(d.${predictionColumn}) === 0`,
              fp: `d => op.round(d.${labelColumn}) === 0 & op.round(d.${predictionColumn}) === 1`,
              fn: `d => op.round(d.${labelColumn}) === 1 & op.round(d.${predictionColumn}) === 0`,
              acc: `d => (op.round(d.${labelColumn}) === 1 & op.round(d.${predictionColumn}) === 1) | (op.round(d.${labelColumn}) === 0 & op.round(d.${predictionColumn}) === 0) `,
            })
            .rollup({
              tp: (d) => op.sum(d.tp),
              tn: (d) => op.sum(d.tn),
              fp: (d) => op.sum(d.fp),
              fn: (d) => op.sum(d.fn),
              acc: (d) => op.sum(d.acc),
              size: (_) => op.count(),
            })
            .object() as ConfusionMatrixEntry
      );
    } else {
      groupScores = [];
    }
  }
</script>

<div
  class="flex flex-col p-2 {fullSize ? 'h-full' : mapHeight(widgetSpec.height)}"
>
  <ComponentHeader
    title={'Confusion Matrix'}
    description={widgetSpec.description}
    {container}
  >
    <div class="mr-4 flex flex-row mb-2 items-center">
      <p class="mr-2">Label column:</p>
      <Dropdown bind:value={labelColumn} items={$filteredTable.columnNames()} />
    </div>
    <div class="mr-4 flex flex-row mb-2 items-center">
      <p class="mr-2">Prediction column:</p>
      <Dropdown
        bind:value={predictionColumn}
        items={$filteredTable.columnNames()}
      />
    </div>
  </ComponentHeader>
  <div bind:this={container}>
    {#if groupScores.length > 0}
      <div class="flex flex-wrap">
        {#each groupScores as scores, i}
          {#if scores.size > 0}
            <ConfusionMatrix
              groupName={$groupNames[i]}
              {scores}
              {predictionColumn}
              {labelColumn}
            />
          {/if}
        {/each}
      </div>
    {:else}
      <ConfusionMatrix {scores} {predictionColumn} {labelColumn} />
    {/if}
  </div>
</div>
