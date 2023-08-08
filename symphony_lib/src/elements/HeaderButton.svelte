<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  export let selected: boolean;
  export let value: string;
</script>

<button
  class="bg-transparent px-2 {selected
    ? 'text-text-dark'
    : 'text-text-dimmed hover:text-text-dark'}"
  {value}
  on:click
>
  {value}
</button>
