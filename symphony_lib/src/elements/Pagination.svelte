<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type ColumnTable from "arquero/dist/types/table/column-table";
  import type { Writable } from "svelte/store";
  import type { SymphonySpec, TooltipSpec } from "../types";

  import { selectAll } from "../helpers/selection";
  import IconButton from "./IconButton.svelte";
  import DataSample from "./DataSample.svelte";
  import PaginationControls from "./PaginationControls.svelte";

  import Fa from "svelte-fa";
  import { faCheckSquare } from "@fortawesome/free-solid-svg-icons/faCheckSquare";

  export let title: string;
  export let filteredTable: ColumnTable;
  export let selected: Writable<string[]>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let tooltip: Writable<TooltipSpec>;

  let page = 0;
  function resetPage() {
    page = 0;
  }

  $: {
    filteredTable;
    resetPage();
  }

  $: dataPoints = filteredTable
    .slice(
      page * $symphonySpec.instancesPerPage,
      Math.min(
        page * $symphonySpec.instancesPerPage + $symphonySpec.instancesPerPage,
        filteredTable.size
      )
    )
    .objects();
</script>

<div class="w-full border rounded-md border-midgrey p-2">
  <div
    class="flex items-center mb-2 justify-between border-b pb-1 border-midgrey"
  >
    <h3 class="font-bold whitespace-nowrap mr-3">
      {title}
    </h3>
    <IconButton
      uiChange={true}
      on:click={() => {
        selectAll(
          selected,
          dataPoints.map((d) => d[$symphonySpec.idColumn])
        );
      }}
    >
      <Fa icon={faCheckSquare} slot="icon" />
    </IconButton>
  </div>
  <div
    class="flex flex-nowrap items-top border-b border-midgrey justify-between"
  >
    <div class="flex flex-wrap content-top">
      {#each dataPoints as dataPoint}
        <DataSample {dataPoint} {symphonySpec} {selected} {tooltip} />
      {/each}
    </div>
    <slot name="extra" />
  </div>
  <PaginationControls
    bind:page
    size={filteredTable.size}
    instancesPerPage={$symphonySpec.instancesPerPage}
  />
</div>
