<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  export let value: number;
  export let title: string;
</script>

<div class="flex justify-between items-center">
  <span class="pr-1">{title}</span>
  <input class="rounded border border-midgrey w-24" type="number" bind:value />
</div>
