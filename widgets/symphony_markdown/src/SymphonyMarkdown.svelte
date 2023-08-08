<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { MarkdownSpec } from '@apple/symphony-lib';
  import { createEventDispatcher } from 'svelte';

  import Fa from 'svelte-fa';
  import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
  import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
  import * as showdown from 'showdown';
  import { AceEditor } from 'svelte-ace';

  import { IconButton, mapHeight, ComponentHeader } from '@apple/symphony-lib';

  export let widgetSpec: MarkdownSpec;
  export let fullSize: boolean = false;

  const dispatch = createEventDispatcher();
  const classMap: Record<string, string> = {
    h1: 'text-xl font-bold',
    h2: 'text-l font-bold',
    ul: 'list-disc',
    ol: 'list-decimal',
    table: 'table-auto',
    a: 'underline',
  };
  const bindings = Object.keys(classMap).map((key) => ({
    type: 'output',
    regex: new RegExp(`<${key}(.*)>`, 'g'),
    replace: `<${key} class="${classMap[key]}" $1>`,
  }));
  const converter = new showdown.Converter({ extensions: [...bindings] });
  let container: HTMLDivElement;
  let editMode = false;
  let source = widgetSpec.content;

  $: html = converter.makeHtml(source);
  $: updateSpecElements(source);
  function updateSpecElements(source: string) {
    const newSpec = { ...widgetSpec, content: source };
    dispatch('specChanged', { spec: newSpec });
  }
</script>

<div
  class="flex flex-col p-2 {fullSize ? 'h-full' : mapHeight(widgetSpec.height)}"
>
  <ComponentHeader
    title={widgetSpec.title}
    description={widgetSpec.description}
    {container}
  >
    <div>
      <IconButton on:click={() => (editMode = !editMode)}>
        <Fa icon={editMode ? faCheck : faEdit} slot="icon" />
        <span slot="text">{editMode ? 'Done' : 'Edit'}</span>
      </IconButton>
    </div>
  </ComponentHeader>
  <div bind:this={container} class="overflow-auto">
    {#if editMode}
      <AceEditor
        width="100%"
        height="300px"
        bind:value={source}
        lang="Markdown"
        theme="Xcode"
        options={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          wrap: true,
          showGutter: true,
          showPrintMargin: false,
          showLineNumbers: true,
          maxLines: 'Infinity',
        }}
      />
    {/if}
    <div class="pl-1">
      {@html html}
    </div>
  </div>
</div>
