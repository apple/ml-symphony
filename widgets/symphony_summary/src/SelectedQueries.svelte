<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { QueryElement } from '@apple/symphony-lib';

  import Fa from 'svelte-fa';
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';

  export let selectedQueries: QueryElement[];

  const dispatch = createEventDispatcher();

  function previousQuery(query: QueryElement) {
    dispatch('previousQuery', { query: query });
  }
</script>

<div class="flex flex-col">
  {#each selectedQueries as query}
    <div
      class="flex flex-grow justify-center items-center m-1 p-1 border rounded cursor-pointer bg-midgrey"
      on:click={() => previousQuery(query)}
      transition:slide
    >
      {#if query.icon !== undefined}
        <Fa icon={query.icon} />
      {/if}
      <span class="pl-1">{query.name}</span>
    </div>
  {/each}
</div>
