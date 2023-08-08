<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type {
    WidgetInfo,
    SymphonySpec,
    WidgetSpec,
    SummaryWidgetSpec,
  } from '@apple/symphony-lib';

  import { onMount, SvelteComponent } from 'svelte';
  import {
    AppHeader,
    DataSampleDetail,
    dataTable,
    symphonySpec,
    tooltip,
    filter,
    filterError,
    table,
    groupColumns,
    groupNames,
    groupedTables,
    filteredTable,
    selected,
    widgetSpecs,
  } from '@apple/symphony-lib';

  import StandalonePage from './StandalonePage.svelte';
  import Toolbar from './toolbar/Toolbar.svelte';

  export let components: Record<string, typeof SvelteComponent>;

  const URL_PARAMS = new URLSearchParams(window.location.search);

  let widgetInfo: WidgetInfo | undefined = undefined;
  let loading = false;
  let selectedPage: string | undefined = undefined;

  $: pages = widgetInfo === undefined ? [] : Object.keys(widgetInfo.pages);
  $: selectedPage =
    selectedPage === undefined && pages !== undefined ? pages[0] : selectedPage;
  $: symphonySpec.set(
    widgetInfo === undefined
      ? ({} as SymphonySpec)
      : (widgetInfo.spec as SymphonySpec)
  );

  function clearURL(widgetInfo: WidgetInfo) {
    URL_PARAMS.delete('filter');
    URL_PARAMS.delete('groupColumns');
    URL_PARAMS.delete('selected');
    URL_PARAMS.delete('widgetSpecs');
    URL_PARAMS.set('widgetInfo', JSON.stringify(widgetInfo));
  }

  function updateURL() {
    window.history.replaceState({}, '', `${location.pathname}?${URL_PARAMS}`);
  }

  onMount(() => {
    loadSymphonyData().then((_) => {
      loading = false;
      if (
        !URL_PARAMS.has('widgetInfo') ||
        URL_PARAMS.get('widgetInfo')!.length == 0
      ) {
        clearURL(widgetInfo!);
      } else {
        const urlWidgetInfo = JSON.parse(
          URL_PARAMS.get('widgetInfo')!
        ) as WidgetInfo;

        if (widgetInfo!.exportID === urlWidgetInfo.exportID) {
          widgetInfo = urlWidgetInfo;
          if (URL_PARAMS.has('filter')) filter.set(URL_PARAMS.get('filter')!);
          if (
            URL_PARAMS.has('groupColumns') &&
            URL_PARAMS.get('groupColumns')!.length > 0
          )
            groupColumns.set(URL_PARAMS.get('groupColumns')!.split('|'));
          if (
            URL_PARAMS.has('selected') &&
            URL_PARAMS.get('selected')!.length > 0
          )
            selected.set(URL_PARAMS.get('selected')!.split('|'));
          if (URL_PARAMS.has('page') && URL_PARAMS.get('page')!.length > 0)
            selectedPage = URL_PARAMS.get('page')!;
          if (
            URL_PARAMS.has('widgetSpecs') &&
            URL_PARAMS.get('widgetSpecs')!.length > 0
          ) {
            widgetSpecs.set(
              JSON.parse(URL_PARAMS.get('widgetSpecs')!) as Record<
                string,
                WidgetSpec | SummaryWidgetSpec
              >
            );
          }
        } else {
          clearURL(widgetInfo!);
        }
      }

      filter.subscribe((filt) => {
        URL_PARAMS.set('filter', filt);
        updateURL();
      });
      groupColumns.subscribe((cols) => {
        URL_PARAMS.set('groupColumns', cols.join('|'));
        updateURL();
      });
      selected.subscribe((sel) => {
        URL_PARAMS.set('selected', sel.join('|'));
        updateURL();
      });
      widgetSpecs.subscribe((specs) => {
        URL_PARAMS.set('widgetSpecs', JSON.stringify(specs));
        updateURL();
      });
    });
  });

  async function loadSymphonyData() {
    loading = true;
    const infoQuery = await fetch('data/widget_info.json');
    await loadArrowTable();
    widgetInfo = await infoQuery.json();
  }

  function pageSelected(e: MouseEvent) {
    const button = e.target as HTMLButtonElement;
    selectedPage = button.value;
    URL_PARAMS.set('page', selectedPage);
    updateURL();
  }

  async function loadArrowTable() {
    fetch('data/table.arrow').then(function (response) {
      if (response.ok) {
        response
          .arrayBuffer()
          .then((buffer) => dataTable.set(new DataView(buffer)));
      } else {
        fetch('data/table.txt').then(function (response) {
          if (response.ok) {
            response.text().then(function (text) {
              fetch(text).then(function (response) {
                response
                  .arrayBuffer()
                  .then((buffer) => dataTable.set(new DataView(buffer)));
              });
            });
          } else {
            throw new Error('Table could not be loaded.');
          }
        });
      }
    });
  }
</script>

{#if widgetInfo !== undefined}
  <div class="flex flex-col" style="height: 100%;">
    <AppHeader
      experiment={widgetInfo.experiment}
      {pages}
      {selectedPage}
      on:click={pageSelected}
    />
    <div class="flex flex-grow overflow-auto">
      <main class="p-2 flex-1 overflow-y-auto bg-body-light text-text-light">
        {#if selectedPage !== undefined && widgetInfo.pages[selectedPage] !== undefined}
          <StandalonePage
            widgets={widgetInfo.pages[selectedPage]}
            {filter}
            {filterError}
            {table}
            {symphonySpec}
            {groupColumns}
            {groupNames}
            {groupedTables}
            {filteredTable}
            {selected}
            {tooltip}
            {widgetSpecs}
            {components}
          />
        {:else}
          No page to display.
        {/if}
      </main>
      <div class="border-midgrey border-l-2 bg-lightgrey overflow-hidden">
        <Toolbar
          {filter}
          {filterError}
          {table}
          {symphonySpec}
          {groupColumns}
          {groupNames}
          {groupedTables}
          {filteredTable}
          {selected}
          {tooltip}
          {widgetSpecs}
          notebook={false}
        />
      </div>
    </div>
  </div>
{:else if loading}
  <div class="flex flex-col h-screen">
    <AppHeader />
    <div class="flex flex-col h-screen p-4">Loading widget data.</div>
  </div>
{:else}
  <div class="flex flex-col h-screen">
    <AppHeader />
    <div class="flex flex-col h-screen p-4">No widget data to display.</div>
  </div>
{/if}
<DataSampleDetail {symphonySpec} {tooltip} />

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
