<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { ClassificationSpec } from '@apple/symphony-lib';
  import type { Readable, Writable } from 'svelte/store';

  import { Vega } from 'svelte-vega';
  import {
    Dropdown,
    MultiSelect,
    mapHeight,
    ComponentHeader,
  } from '@apple/symphony-lib';

  import { getSchema, SchemaType } from './vegaSchemas';
  import type { ExprObject } from 'arquero/dist/types/table/transformable';

  export let groupNames: Writable<string[][]>;
  export let groupedTables: Readable<ColumnTable[]>;
  export let filteredTable: Readable<ColumnTable>;
  export let widgetSpec: ClassificationSpec;
  export let fullSize: boolean = false;

  let container: HTMLDivElement;
  let predictionColumn = widgetSpec.predictionColumn
    ? widgetSpec.predictionColumn
    : $filteredTable.columnName(0);
  let labelColumn = widgetSpec.labelColumn
    ? widgetSpec.labelColumn
    : $filteredTable.columnName(0);
  let mainWidth = 0;

  const availableMetrics = [
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'precision_mac', label: 'Precision (Macro)' },
    { value: 'precision_mic', label: 'Precision (Micro)' },
    { value: 'recall_mac', label: 'Recall (Macro)' },
    { value: 'recall_mic', label: 'Recall (Micro)' },
    { value: 'f1_mac', label: 'F1 Score (Micro)' },
    { value: 'f1_mic', label: 'F1 Score (Macro)' },
  ];
  let plotType: string = 'Strip Plot';
  let selectedMetrics: { value: string; label: string }[] = [
    { value: 'accuracy', label: 'Accuracy' },
  ];

  $: mappedData =
    $groupNames.length > 0
      ? $groupedTables.map((table, i) =>
          processTable(table, i, labelColumn, predictionColumn)
        )
      : [processTable($filteredTable, 0, labelColumn, predictionColumn)];

  function processTable(
    table: ColumnTable,
    index: number,
    labelColumn: string,
    predictionColumn: string
  ): Record<string, unknown> {
    const labelArray = table.array(labelColumn);
    const predictionArray = table.array(predictionColumn);
    const classes = new Set(labelArray);
    if (
      classes.size === 0 ||
      typeof labelArray[0] !== 'string' ||
      typeof predictionArray[0] !== 'string'
    ) {
      return {};
    }
    let rollupMap: ExprObject = {
      accuracy: `(d) => op.sum(d.correct) / op.count()`,
    };
    classes.forEach((cls: string) => {
      rollupMap[
        `tp_${cls}`
      ] = `d => op.sum(d.${labelColumn} === '${cls}' && d.${predictionColumn} === '${cls}')`;
      rollupMap[
        `fp_${cls}`
      ] = `d => op.sum(d.${labelColumn} !== '${cls}' && d.${predictionColumn} === '${cls}')`;
      rollupMap[
        `tn_${cls}`
      ] = `d => op.sum(d.${labelColumn} !== '${cls}' && d.${predictionColumn} !== '${cls}')`;
      rollupMap[
        `fn_${cls}`
      ] = `d => op.sum(d.${labelColumn} === '${cls}' && d.${predictionColumn} !== '${cls}')`;
    });

    let baseMetrics: Record<string, number> = table
      .derive({
        correct: `d => d.${labelColumn} === d.${predictionColumn}`,
      })
      .rollup(rollupMap)
      .object() as Record<string, number>;

    const classesArray = [...classes];
    const precision_mac =
      classesArray.reduce(
        (sum, cls) =>
          sum +
          baseMetrics[`tp_${cls}`] /
            (baseMetrics[`tp_${cls}`] + baseMetrics[`fp_${cls}`]),
        0
      ) / classesArray.length;
    const recall_mac =
      classesArray.reduce(
        (sum, cls) =>
          sum +
          baseMetrics[`tp_${cls}`] /
            (baseMetrics[`tp_${cls}`] + baseMetrics[`fn_${cls}`]),
        0
      ) / classesArray.length;
    const precision_mic =
      classesArray.reduce((sum, cls) => sum + baseMetrics[`tp_${cls}`], 0) /
      classesArray.reduce(
        (sum, cls) => sum + baseMetrics[`tp_${cls}`] + baseMetrics[`fp_${cls}`],
        0
      );
    const recall_mic =
      classesArray.reduce((sum, cls) => sum + baseMetrics[`tp_${cls}`], 0) /
      classesArray.reduce(
        (sum, cls) => sum + baseMetrics[`tp_${cls}`] + baseMetrics[`fn_${cls}`],
        0
      );
    return {
      name: $groupNames[index],
      size: table.size,
      ...baseMetrics,
      accuracy: baseMetrics.accuracy,
      precision_mic: precision_mic,
      recall_mic: recall_mic,
      precision_mac: precision_mac,
      recall_mac: recall_mac,
      f1_mac: (2 * precision_mac * recall_mac) / (precision_mac + recall_mac),
      f1_mic: (2 * precision_mic * recall_mic) / (precision_mic + recall_mic),
    };
  }

  function handleClear(event: CustomEvent) {
    if (event) {
      selectedMetrics = selectedMetrics.filter((d) => d !== event.value);
    } else {
      selectedMetrics = [];
    }
  }
</script>

<div
  style="min-height: 250px"
  class="flex flex-col p-2 {fullSize ? 'h-full' : mapHeight(widgetSpec.height)}"
>
  <ComponentHeader
    title={'FairVis'}
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
    <div class="mr-4 flex flex-row mb-2 items-center">
      <p class="mr-2">Plot type:</p>
      <Dropdown bind:value={plotType} items={['Beeswarm', 'Strip Plot']} />
    </div>
  </ComponentHeader>
  <div class="flex items-center">
    <div>
      <MultiSelect
        placeholder="Select metrics to show"
        items={availableMetrics}
        value={selectedMetrics}
        on:select={(ev) => (selectedMetrics = ev.detail)}
        on:clear={(ev) => handleClear(ev.detail)}
      />
    </div>
  </div>
  <div class="flex flex-col overflow-y-auto" bind:this={container}>
    {#if selectedMetrics !== null}
      {#each selectedMetrics as metric}
        <div class="pl-2" bind:offsetWidth={mainWidth}>
          <h4 class="text-lg pt-2">{metric.label}</h4>
          {#if mappedData.length > 1 && mappedData[0][metric.value] !== undefined}
            <Vega
              spec={plotType == 'Beeswarm'
                ? getSchema(SchemaType.beeswarm, mainWidth)
                : getSchema(SchemaType.strip, mainWidth)}
              data={{
                table: mappedData.map((d) => ({
                  name: d.name,
                  size: d.size,
                  metric: d[metric.value],
                })),
              }}
              options={{
                actions: false,
              }}
            />
          {:else if mappedData[0][metric.value] !== undefined}
            {mappedData[0][metric.value]}
          {:else}
            There need to be labels of type string.
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>
