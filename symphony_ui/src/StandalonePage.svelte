<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type {
    Widget,
    SymphonySpec,
    TooltipSpec,
    WidgetSpec,
    SummaryWidgetSpec,
  } from '@apple/symphony-lib';
  import type { Readable, Writable } from 'svelte/store';
  import type { SvelteComponent } from 'svelte';
  import type ColumnTable from 'arquero/dist/types/table/column-table';

  import { mapHeight, mapWidth } from '@apple/symphony-lib';

  import StandaloneWidget from './StandaloneWidget.svelte';

  export let filter: Writable<string>;
  export let filterError: Writable<string>;
  export let table: Readable<ColumnTable>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let groupColumns: Writable<string[]>;
  export let groupNames: Writable<string[][]>;
  export let groupedTables: Readable<ColumnTable[]>;
  export let filteredTable: Readable<ColumnTable>;
  export let selected: Writable<string[]>;
  export let tooltip: Writable<TooltipSpec>;
  export let widgets: Widget[];
  export let components: Record<string, typeof SvelteComponent>;
  export let widgetSpecs: Writable<
    Record<string, WidgetSpec | SummaryWidgetSpec>
  >;

  $: fullSize = widgets.length === 1;
</script>

<div class={fullSize ? 'h-full w-full' : 'grid grid-cols-6 main-grid gap-2'}>
  {#each widgets as widget}
    <div
      class={fullSize
        ? 'h-full w-full'
        : `${mapHeight(widget.height)} ${mapWidth(
            widget.width
          )} border-2 border-midgrey rounded`}
    >
      <StandaloneWidget
        {widget}
        {filter}
        {filterError}
        {table}
        {symphonySpec}
        {groupColumns}
        {groupNames}
        {groupedTables}
        {filteredTable}
        {selected}
        {tooltip}
        {components}
        {fullSize}
        {widgetSpecs}
      />
    </div>
  {/each}
</div>
