<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import HeaderButton from "./HeaderButton.svelte";
  import Promo from "./Promo.svelte";

  export let experiment: string | undefined = undefined;
  export let pages: string[] | undefined = undefined;
  export let selectedPage: string | undefined = undefined;
</script>

<nav class="p-2 pl-3 bg-black flex justify-between">
  <div class="flex items-center">
    <h2 class="text-2xl font-bold text-text-dark">Symphony</h2>
    {#if pages !== undefined}
      <div class="flex pl-12 overflow-auto">
        {#each pages as page}
          <HeaderButton
            selected={page === selectedPage}
            value={page}
            on:click
          />
        {/each}
      </div>
    {/if}
  </div>
  <div class="flex items-center pl-4">
    {#if experiment !== undefined}
      <h2 class="text-text-dark font-bold pr-4">
        {experiment}
      </h2>
    {/if}
    <Promo />
  </div>
</nav>
