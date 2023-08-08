<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type {
    WidgetSpec,
    SymphonySpec,
    TooltipSpec,
  } from '@apple/symphony-lib';
  import type { Readable, Writable } from 'svelte/store';
  import type ColumnTable from 'arquero/dist/types/table/column-table';

  import createScatterplot from 'regl-scatterplot';
  import { op } from 'arquero';
  import { watchResize } from 'svelte-watch-resize';

  import {
    mapHeightFixed,
    Dropdown,
    getColumnType,
    isStringColumnBinnable,
    ComponentHeader,
  } from '@apple/symphony-lib';
  import ScatterplotLegend from './ScatterplotLegend.svelte';

  export let symphonySpec: Writable<SymphonySpec>;
  export let tooltip: Writable<TooltipSpec>;
  export let table: Readable<ColumnTable>;
  export let filteredTable: Readable<ColumnTable>;
  export let widgetSpec: WidgetSpec;
  export let fullSize: boolean = false;
  export let selected: Writable<string[]>;

  let container: HTMLDivElement;
  let scatterCanvas: HTMLCanvasElement;
  let idArray: string[];
  let categoryColumn: string;
  let scatterplot: any = undefined;
  let clientX = 0;
  let clientY = 0;
  let selectedLayer: string;
  let target = [0, 0];
  let distance = 1;
  let colorScale = [
    '#308BEF',
    '#4DC960',
    '#FF9500',
    '#EF5C53',
    '#A34FCD',
    '#00A39B',
    '#98685E',
    '#EEDB41',
  ];

  $: categories = (
    $filteredTable
      .rollup({
        col: op.array_agg_distinct(categoryColumn),
      })
      .object() as any
  ).col;
  $: {
    if (scatterplot !== undefined) {
      const toSelectIds = $selected.map((point: string) =>
        idArray.indexOf(point)
      );
      scatterplot.deselect();
      scatterplot.select(toSelectIds, { preventEvent: true });
    }
  }

  $: categoryColumns = $filteredTable.columnNames().filter((columnName) => {
    return (
      getColumnType($filteredTable, columnName) === 'string' &&
      isStringColumnBinnable(columnName, $filteredTable)
    );
  });

  // Get the column table based on which we look at familiarity
  $: columnNames = $filteredTable.columnNames((d) =>
    d.startsWith('projection_')
  );
  $: layerNames = [
    ...new Set(columnNames.map((name) => name.substring(11, name.length - 2))),
  ];
  $: {
    if (selectedLayer === undefined)
      selectedLayer = layerNames[0] === undefined ? '' : layerNames[0];
  }
  $: xColumn =
    selectedLayer === undefined
      ? undefined
      : columnNames.find(
          (name) => name.includes(selectedLayer) && name.endsWith('_x')
        )!;
  $: yColumn =
    selectedLayer === undefined
      ? undefined
      : columnNames.find(
          (name) => name.includes(selectedLayer) && name.endsWith('_y')
        )!;

  $: if (scatterCanvas !== undefined) {
    if (scatterplot !== undefined) {
      scatterplot.destroy();
    }
    scatterplot = createScatterplot({
      canvas: scatterCanvas,
      lassoInitiator: true,
      colorBy: 'valueA',
      deselectOnDblClick: false,
      deselectOnEscape: false,
      pointColor: colorScale,
    });
    scatterplot.subscribe('select', selectPoints);
    scatterplot.subscribe('pointOver', hoverPoint);
    scatterplot.subscribe('pointOut', () =>
      tooltip.update((t: TooltipSpec) => {
        t.hover = false;
        return { ...t };
      })
    );
  }

  $: if (
    xColumn !== undefined &&
    yColumn !== undefined &&
    scatterplot !== undefined
  ) {
    const points: number[][] = [];
    const table = $filteredTable;
    const xArray = table.array(xColumn);
    const yArray = table.array(yColumn);
    let maxX = 0,
      minX = 0,
      maxY = 0,
      minY = 0;
    idArray = table.array($symphonySpec.idColumn) as string[];

    if (categoryColumn !== undefined) {
      const categoryArray = table.array(categoryColumn);
      const categories = table
        .groupby(categoryColumn)
        .count()
        .array(categoryColumn) as string[];
      xArray.forEach((item, i) => {
        maxX = maxX > item ? maxX : item;
        minX = minX < item ? minX : item;
        maxY = maxY > item ? maxY : item;
        minY = minY < item ? minY : item;
        points.push([item, yArray[i], categories.indexOf(categoryArray[i])]);
      });
    } else {
      xArray.forEach((item, i) => points.push([item, yArray[i]]));
    }
    distance = Math.max(maxX - minX, maxY - minY) / 2;
    target = [(maxX + minX) / 2, (maxY + minY) / 2];
    initPoints(points);
  }

  function initPoints(points: number[][]) {
    scatterplot.set({
      cameraTarget: target,
      cameraDistance: distance,
      pointSize: 15,
    });
    scatterplot.clear();
    const drawPromise = scatterplot.draw(points);
    drawPromise.then(initialSelect);
  }

  function initialSelect() {
    const toSelectIds = $selected.map((point: string) =>
      idArray.indexOf(point)
    );
    scatterplot.select(toSelectIds, { preventEvent: true }); // TODO: Why does this not work?
  }

  function selectPoints(points: any) {
    let toSelectIds = points.points.map((d) => idArray[d]);
    let currentlySelected: Set<string> = new Set<string>($selected);

    toSelectIds.forEach((id: string) => {
      if (currentlySelected.has(id)) {
        currentlySelected.delete(id);
      } else {
        currentlySelected.add(id);
      }
    });
    selected.set(Array.from(currentlySelected));
  }

  function hoverPoint(point: any) {
    let row: Record<string, unknown> = {};
    $table.columnNames().forEach((col) => {
      row[col] = $filteredTable.get(col, point);
    });
    tooltip.set({
      hover: true,
      mousePos: { x: clientX, y: clientY },
      fetchPrefix: $symphonySpec.filesPath,
      instance: row,
    });
  }

  function handleKeydown(event: MouseEvent) {
    scatterplot.set({
      cameraTarget: target,
      cameraDistance: distance,
    });
  }

  function resized() {
    if (scatterplot !== undefined) {
      scatterplot.destroy();
    }
    scatterplot = createScatterplot({
      canvas: scatterCanvas,
      lassoInitiator: true,
      colorBy: 'valueA',
      deselectOnDblClick: false,
      deselectOnEscape: false,
      pointColor: colorScale,
    });
    scatterplot.subscribe('select', selectPoints);
    scatterplot.subscribe('pointOver', hoverPoint);
    scatterplot.subscribe('pointOut', () =>
      tooltip.update((t: TooltipSpec) => {
        t.hover = false;
        return { ...t };
      })
    );
  }
</script>

<svelte:window
  on:mousemove={(ev) => {
    clientX = ev.clientX;
    clientY = ev.clientY;
  }}
/>

<div
  class="flex flex-col p-2 {fullSize
    ? 'h-full'
    : mapHeightFixed(widgetSpec.height)}"
>
  <ComponentHeader
    title={'Scatterplot'}
    description={widgetSpec.description}
    {container}
  >
    {#if layerNames.length > 1}
      <div class="mr-4 flex flex-row mb-2 items-center">
        <p class="mr-2">Layer:</p>
        <Dropdown items={layerNames} bind:value={selectedLayer} />
      </div>
    {/if}
    {#if categoryColumns.length > 0}
      <div class="mr-4 flex flex-row mb-2 items-center">
        <p class="mr-2">Category column:</p>
        <Dropdown bind:value={categoryColumn} items={categoryColumns} />
      </div>
    {/if}
  </ComponentHeader>
  <div>Double-click to recenter. Shift-click and drag to lasso-select.</div>
  <div
    bind:this={container}
    class="flex-grow relative"
    on:dblclick={handleKeydown}
    use:watchResize={resized}
  >
    {#if xColumn !== undefined && yColumn !== undefined}
      <canvas bind:this={scatterCanvas} />
      <ScatterplotLegend {categories} {colorScale} />
    {:else}
      <p>
        There needs to be both a column starting with 'projection_' and ending
        on '_x' and one starting with 'projection_' and ending on '_y'.
      </p>
    {/if}
  </div>
</div>
