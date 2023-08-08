<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  export let title: string | undefined = undefined;
  export let categories: string[] | undefined = undefined;
</script>

<div class="flex flex-col border-midgrey border rounded-md p-2 w-full">
  <div class="flex items-top mb-2 justify-between border-b pb-1 border-midgrey">
    <slot name="header" />
  </div>
  <div class="flex items-center">
    <slot name="icon" />
    {#if title !== undefined}
      <span class="pr-2 text-lg">{title}</span>
    {/if}
    {#if categories !== undefined}
      {#each categories as category}
        <span class="pr-1 text-sm">{category}</span>
      {/each}
    {/if}
  </div>
  <slot name="content" />
</div>
