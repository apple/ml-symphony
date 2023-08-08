<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { QueryElement } from '@apple/symphony-lib';

  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import SelectedQueries from './SelectedQueries.svelte';
  import NextQueries from './NextQueries.svelte';
  import { getQueryTree } from './summarySpecs';

  import type ColumnTable from 'arquero/dist/types/table/column-table';

  export let table: ColumnTable;

  const dispatch = createEventDispatcher();
  let selectedQueries: QueryElement[] = [];
  let currentQuery: QueryElement = getQueryTree(table);

  function querySelected(event: CustomEvent) {
    const query = event.detail.query as QueryElement;
    if (typeof query.next === 'function') {
      dispatch('elementSelected', {
        element: query.next(
          selectedQueries.map((query) => query.name),
          table
        ),
      });
      currentQuery = getQueryTree(table);
      selectedQueries = [];
    } else {
      selectedQueries = [...selectedQueries, query];
      currentQuery = query;
    }
  }

  function previousQuery(event: CustomEvent) {
    const previousQuery = event.detail.query as QueryElement;
    const index = selectedQueries.findIndex((query) => query === previousQuery);
    if (index === 0) {
      currentQuery = getQueryTree(table);
      selectedQueries = [];
    } else {
      currentQuery = selectedQueries[index - 1];
      selectedQueries.slice(index - 1);
    }
  }
</script>

<div
  class="flex flex-col p-2 bg-lightgrey border-midgrey border-2 rounded select-none"
  transition:fade
>
  <div class="flex flex-col">
    <SelectedQueries {selectedQueries} on:previousQuery={previousQuery} />
    <NextQueries {currentQuery} on:querySelected={querySelected} />
  </div>
</div>
