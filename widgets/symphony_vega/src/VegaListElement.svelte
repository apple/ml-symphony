<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { EmbedOptions } from 'vega-embed';
  import type { VegaElement } from '@apple/symphony-lib';
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Writable } from 'svelte/store';

  import { Vega } from 'svelte-vega';

  export let element: VegaElement;
  export let filteredTable: Writable<ColumnTable>;

  let options = {
    actions: false,
  } as EmbedOptions;

  $: spec =
    typeof element.data.values === 'string' &&
    (element.data.values as string) === 'arrow_table'
      ? { ...element, data: { values: $filteredTable } }
      : element;
</script>

<div class="rounded m-1 flex flex-col">
  <Vega {spec} {options} />
</div>
