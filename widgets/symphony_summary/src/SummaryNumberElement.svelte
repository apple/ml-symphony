<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { SummaryDataElement } from '@apple/symphony-lib';

  export let data: SummaryDataElement;
  export let name: string;
  export let editMode: boolean;
</script>

<div
  class="{editMode ? 'border border-button_outline ' : ''} flex p-2 m-1 rounded"
>
  <p class="font-bold mr-2">
    {name}:
  </p>
  <p>
    {data.toLocaleString()}
  </p>
</div>
