<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  export let categories: string[];
  export let colorScale: string[];
</script>

<div
  class="absolute top-4 right-4 flex flex-col justify-items-end bg-lightgrey p-2 bg-opacity-90"
>
  {#each categories as category, i}
    <div class="flex items-center pb-1 justify-end">
      <p class="pr-2">{category}</p>
      <div class="h-2 w-2" style="background-color: {colorScale[i]};" />
    </div>
  {/each}
</div>
