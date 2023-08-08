<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { DOMWidgetModel } from "@jupyter-widgets/base";
  import type { SvelteComponent } from "svelte";
  import type { WidgetSpec, SummaryWidgetSpec } from "./types";

  import {
    selected,
    filter,
    groupColumns,
    groupNames,
    symphonySpec,
    dataTable,
    filterError,
    tooltip,
    table,
    filteredTable,
    groupedTables,
    widgetWritable,
    initializeStores,
  } from "./stores";

  import { DataSampleDetail } from "./elements";

  export let model: DOMWidgetModel;
  export let widget: SvelteComponent;

  initializeStores(model);

  let widgetSpec = widgetWritable<WidgetSpec | SummaryWidgetSpec>(
    "widget_spec",
    model.attributes.widget_spec
  );
  widgetSpec.setModel(model);

  function handleSpecChanged(event: CustomEvent) {
    widgetSpec.set(event.detail.spec);
  }
</script>

{#if $table && $widgetSpec}
  <div
    class="{$widgetSpec.name === 'toolbar'
      ? 'border-midgrey border-2'
      : ''} mt-2 h-full"
    style="min-height: 350px"
  >
    <svelte:component
      this={widget}
      widgetSpec={$widgetSpec}
      on:specChanged={handleSpecChanged}
      {selected}
      {filter}
      {groupColumns}
      {groupNames}
      {symphonySpec}
      {dataTable}
      {filterError}
      {tooltip}
      {table}
      {filteredTable}
      {groupedTables}
      notebook={true}
    />
  </div>
{:else}
  No data to show.
{/if}
<DataSampleDetail {tooltip} {symphonySpec} />
