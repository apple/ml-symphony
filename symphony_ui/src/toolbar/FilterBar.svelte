<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type ColumnTable from 'arquero/dist/types/table/column-table';
  import type { Readable, Writable } from 'svelte/store';

  import Fa from 'svelte-fa';
  import * as ace from 'brace';
  import { AceEditor } from 'svelte-ace';
  import { fade } from 'svelte/transition';
  import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
  import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
  import 'brace/ext/language_tools';
  import 'brace/theme/xcode';
  import './filter_editor_mode';

  import { IconButton, SubHeading } from '@apple/symphony-lib';

  export let filter: Writable<string>;
  export let filterError: Writable<string>;
  export let table: Readable<ColumnTable>;

  let langTools: any = undefined;

  $: cols = $table.columnNames().map((name) => `d.${name}`);
  $: customCompleter = {
    getCompletions: (
      editor: ace.Editor,
      session: ace.IEditSession,
      pos: ace.Position,
      prefix: string,
      callback: any
    ): void => {
      if (prefix === 'd') {
        callback(
          null,
          cols.map((column) => ({
            caption: `${column}: column from arrow`,
            value: column,
            meta: 'Table',
          }))
        );
      }
    },
  };
  $: {
    if (langTools !== undefined) {
      langTools.addCompleter(customCompleter);
    }
  }
  $: filterString = $filter;

  function addFilter() {
    filter.set(filterString.replace(/(\r\n|\n|\r)/gm, ''));
  }

  function clearFilter() {
    filter.set('');
  }

  function initEditor(editor: CustomEvent) {
    langTools = ace.acequire('ace/ext/language_tools');
    editor.detail.commands.addCommand({
      name: 'enter',
      exec: function () {
        addFilter();
      },
      bindKey: { mac: 'enter', windows: 'enter' },
    });
  }
</script>

<div class="flex flex-col">
  <div class="px-2 pt-2">
    <SubHeading heading={'Filter'} />
  </div>
  <div class="p-2 w-full h-auto">
    <div
      class="flex flex-col p-2 w-full h-auto bg-white border border-midgrey rounded justify-center"
    >
      <AceEditor
        width="100%"
        height="auto"
        bind:value={filterString}
        on:init={initEditor}
        lang="filter"
        theme="xcode"
        options={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          wrap: true,
          showGutter: false,
          showPrintMargin: false,
          showLineNumbers: false,
          maxLines: 'Infinity',
        }}
      />
    </div>
    <div class="pt-2 flex items-center justify-end">
      {#if $filter !== ''}
        <div class="pr-2" transition:fade>
          <IconButton on:click={clearFilter}>
            <Fa icon={faTimes} slot="icon" />
            <span slot="text">Clear</span>
          </IconButton>
        </div>
      {/if}
      <IconButton on:click={addFilter}>
        <Fa icon={faFilter} slot="icon" />
        <span slot="text">Apply</span>
      </IconButton>
    </div>
  </div>
  {#if $filterError}
    <p class="text-error m-2">{$filterError}</p>
  {/if}
</div>
