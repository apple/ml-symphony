<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import Icon from "svelte-fa";
  import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
  import { createEventDispatcher } from "svelte";

  export let values: string[];
  export let groupSize: number;

  const dispatch = createEventDispatcher();
</script>

<div
  class="flex items-center m-1 px-2 h-8 w-max border border-button_outline rounded {groupSize >
  0
    ? 'bg-body-light'
    : ''}"
>
  <div class="flex h-full pr-0.5 pl-0.5 items-center">
    {#each values as value, i}
      <div class="text-s pr-0.5 pl-0.5 font-normal max-w-full flex-initial">
        {value}
        {i !== values.length - 1 ? "|" : ""}
      </div>
    {/each}
  </div>
  <div class="text-s text-text-dimmed pr-0.5 pl-0.5">
    ({groupSize.toLocaleString()})
  </div>
  <div class="flex flex-auto pl-1 text-s">
    <button on:click={() => {
        dispatch("remove", { values: values })
        values = [] // clear the value list
      }}>
      <Icon icon={faTimes} />
    </button>
  </div>
</div>
