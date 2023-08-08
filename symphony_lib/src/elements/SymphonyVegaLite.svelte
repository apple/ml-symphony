<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type ColumnTable from "arquero/dist/types/table/column-table";
  import type { EmbedOptions } from "vega-embed";
  import type { VegaLiteSpec } from "svelte-vega";
  import { createEventDispatcher } from "svelte";

  import { VegaLite } from "svelte-vega";
  import { ChartDataResolver, ResolverType } from "../types";
  import * as aq from "arquero";

  export let data: Record<string, unknown> = {};
  export let spec: VegaLiteSpec;
  export let table: ColumnTable;
  export let filteredTable: ColumnTable;
  export let showUnfilteredData: boolean;
  export let width: number | undefined = undefined;
  export let height: number | undefined = undefined;
  export let resolver: ChartDataResolver | undefined = undefined;

  const dispatch = createEventDispatcher();

  let parsedData: Record<string, unknown> = {};
  let parsedSpec: VegaLiteSpec | undefined = undefined;
  let parsedSpecRaw: VegaLiteSpec | undefined = undefined;
  let parsedSpecFiltered: VegaLiteSpec | undefined = undefined;

  let options = {
    actions: false,
  } as EmbedOptions;

  $: if (width) options.width = width;
  $: if (height) options.height = height;
  $: reducedData = extractData(resolver, table, filteredTable);
  $: parseSpecs(spec, data, reducedData, showUnfilteredData);

  function parseSpecs(
    spec: VegaLiteSpec,
    data: Record<string, unknown>,
    reducedData: {
      filtered: Record<string, unknown>;
      raw: Record<string, unknown>;
    },
    showUnfilteredData: boolean
  ) {
    parsedSpec = spec;
    parsedSpecRaw = { ...spec, params: [] };
    parsedSpecFiltered = { ...spec };
    parsedData = data;
    if (typeof data.values === "string") {
      const stringData = data.values as string;
      if (stringData && stringData === "arrow_table") {
        parsedSpecFiltered.data = reducedData.filtered;
        parsedSpecRaw.data = reducedData.raw;
        if (showUnfilteredData) {
          parsedSpecRaw.mark = { ...parsedSpecRaw.mark, color: "#dcdcdc" };
          parsedSpec = {
            layer: [{ ...parsedSpecRaw }, { ...parsedSpecFiltered }],
          };
        } else {
          parsedSpec = { ...parsedSpecFiltered };
        }
        parsedData = {};
      }
    }
  }

  function extractData(
    resolver: ChartDataResolver | undefined,
    table: ColumnTable,
    filteredTable: ColumnTable
  ): { filtered: Record<string, unknown>; raw: Record<string, unknown> } {
    if (resolver === undefined) {
      return { filtered: { values: filteredTable }, raw: { values: table } };
    }
    switch (resolver.type) {
      case ResolverType.NUMBER:
        return {
          filtered: numberResolver(resolver, filteredTable),
          raw: numberResolver(resolver, table),
        };
      default:
        return {
          filtered: binnedStringResolver(resolver, filteredTable),
          raw: binnedStringResolver(resolver, table),
        };
    }
  }

  function binnedStringResolver(
    resolver: ChartDataResolver,
    table: ColumnTable
  ): Record<string, unknown> {
    const reduced_table = table.groupby(resolver.columnName).count();
    return { values: reduced_table };
  }

  function numberResolver(
    resolver: ChartDataResolver,
    table: ColumnTable
  ): Record<string, unknown> {
    const reducedTable = table
      .groupby({
        bin_0: aq.bin(resolver.columnName, { maxbins: 20 }),
        bin_1: aq.bin(resolver.columnName, { maxbins: 20, offset: 1 }),
      })
      .count();
    return { values: reducedTable };
  }

  function handleSelect(_: string, value: unknown) {
    dispatch("select", {
      value: value,
    });
  }

  function handleBrush(_: string, value: unknown) {
    dispatch("brush", {
      value: value,
    });
  }
</script>

<VegaLite
  spec={parsedSpec}
  data={parsedData}
  {options}
  signalListeners={{
    select: handleSelect,
    brush: handleBrush,
  }}
/>
