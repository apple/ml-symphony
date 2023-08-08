<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type {
    Widget,
    SummaryWidgetSpec,
    WidgetSpec,
    SymphonySpec,
    TooltipSpec,
  } from '@apple/symphony-lib';
  import type { Readable, Writable } from 'svelte/store';
  import type ColumnTable from 'arquero/dist/types/table/column-table';

  import { onDestroy, SvelteComponent } from 'svelte';
  import { mapHeight, mapWidth } from '@apple/symphony-lib';

  export let widget: Widget;
  export let fullSize: boolean;
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
  export let components: Record<string, typeof SvelteComponent>;
  export let widgetSpecs: Writable<
    Record<string, WidgetSpec | SummaryWidgetSpec>
  >;

  let widgetSpec: WidgetSpec | SummaryWidgetSpec;
  let oldWidgetType: string;
  let target: HTMLDivElement;
  let cmp: SvelteComponent | undefined;

  $: {
    if ($widgetSpecs[widget.name] !== undefined) {
      widgetSpec = $widgetSpecs[widget.name];
      oldWidgetType = widget.name;
    } else {
      // Need to reload if the widget changes while this view is reused.
      loadSpec(widget);
    }
  }

  $: component = components[widget.name];

  $: if (target && component && oldWidgetType == widget.name) {
    cleanup();
    create();
  }

  $: if (cmp) {
    cmp.$set({
      widgetSpec: widgetSpec,
      fullSize: fullSize,
      filter: filter,
      filterError: filterError,
      table: table,
      vertical: true,
      symphonySpec: symphonySpec,
      groupColumns: groupColumns,
      groupNames: groupNames,
      groupedTables: groupedTables,
      filteredTable: filteredTable,
      selected: selected,
      tooltip: tooltip,
    });
  }

  async function loadSpec(widget: Widget) {
    const infoQuery = await fetch(`data/${widget.name}.json`);
    const preparsedData = (await infoQuery.json()) as
      | WidgetSpec
      | SummaryWidgetSpec;
    widgetSpec = preparsedData;
    oldWidgetType = widget.name;
  }

  function handleSpecChanged(event: CustomEvent) {
    widgetSpec = event.detail.spec;
    let changedSpec = $widgetSpecs;
    changedSpec[widget.name] = event.detail.spec;
    widgetSpecs.set({ ...changedSpec });
  }

  function cleanup() {
    if (cmp === undefined) return;
    cmp.$destroy();
    cmp = undefined;
  }

  function create() {
    cmp = new component({
      target,
      props: {
        widgetSpec: widgetSpec,
        fullSize: fullSize,
        filter: filter,
        filterError: filterError,
        table: table,
        vertical: true,
        symphonySpec: symphonySpec,
        groupColumns: groupColumns,
        groupNames: groupNames,
        groupedTables: groupedTables,
        filteredTable: filteredTable,
        selected: selected,
        tooltip: tooltip,
      },
    });
    cmp.$on('specChanged', handleSpecChanged);
  }

  onDestroy(cleanup);
</script>

<div
  class={fullSize
    ? 'h-full w-full'
    : `${mapHeight(widget.height)} ${mapWidth(widget.width)}`}
  bind:this={target}
/>
