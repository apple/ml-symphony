<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  export let items: string[];
  export let value: string;
</script>

<select bind:value class="rounded border border-midgrey">
  {#each items as item}
    <option value={item}>
      {item}
    </option>
  {/each}
</select>
