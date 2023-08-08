<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  export let active: boolean = true;
  export let title: string;
</script>

<div
  class="flex justify-between items-center"
  on:click={() => (active = !active)}
>
  <span class="pr-1">{title}</span>
  <div
    class="w-10 h-6 flex items-center bg-midgrey rounded-full p-1 duration-100 ease-in-out {active
      ? 'bg-highlight'
      : ''}"
  >
    <div
      class="bg-white w-4 h-4 rounded-full shadow-md transform duration-100 ease-in-out {active
        ? 'translate-x-4'
        : ''}"
    />
  </div>
</div>
