<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { VegaWidgetSpec } from '@apple/symphony-lib';
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Writable } from 'svelte/store';

  import { mapHeight, ComponentHeader } from '@apple/symphony-lib';

  import VegaListElement from './VegaListElement.svelte';

  export let widgetSpec: VegaWidgetSpec;
  export let fullSize: boolean = false;
  export let filteredTable: Writable<ColumnTable>;

  let container: HTMLDivElement;

  $: elements = widgetSpec.vegaElements;
</script>

<div
  class="flex flex-col p-2 {fullSize ? 'h-full' : mapHeight(widgetSpec.height)}"
>
  <ComponentHeader
    title={'Vega Charts'}
    description={widgetSpec.description}
    {container}
  />
  <div class="flex flex-col overflow-auto" bind:this={container}>
    <div class="flex flex-wrap">
      {#each elements as element}
        <div class="relative">
          <VegaListElement {element} {filteredTable} />
        </div>
      {/each}
    </div>
  </div>
</div>
