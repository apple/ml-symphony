<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import Tooltip from "./Tooltip.svelte";

  export let heading: string;
  export let description: string;

  let hover = false;
  let offsetX = 0;
</script>

<div class="flex items-center justify-between pb-3 pr-4">
  <div class="flex items-center">
    <h2 class="text-2xl font-bold leading-7 text-gray-900 pr-2">
      {heading}
    </h2>
    <Tooltip text={description} />
  </div>
</div>
