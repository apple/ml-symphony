<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  export let value: string;
  export let placeholder: string = "";
</script>

<input
  bind:value
  class="border border-midgrey rounded w-full"
  type="text"
  {placeholder}
/>
