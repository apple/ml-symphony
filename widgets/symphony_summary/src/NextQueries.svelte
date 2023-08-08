<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { QueryElement } from '@apple/symphony-lib';

  import Fa from 'svelte-fa';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let currentQuery: QueryElement;

  $: nextQueries = currentQuery.next as QueryElement[];

  const dispatch = createEventDispatcher();

  function querySelected(query: QueryElement) {
    dispatch('querySelected', { query: query });
  }
</script>

<div class="flex flex-wrap" transition:fade>
  {#each nextQueries as query}
    <div
      class="flex flex-grow justify-center items-center m-1 p-1 border border-midgrey rounded cursor-pointer"
      on:click={() => querySelected(query)}
    >
      {#if query.icon !== undefined}
        <Fa color="#7f7f7f" icon={query.icon} />
      {/if}
      <span class="pl-1 text-darkgrey">{query.name}</span>
    </div>
  {/each}
</div>
