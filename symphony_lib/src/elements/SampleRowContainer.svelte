<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { SymphonySpec, TooltipSpec } from "../types";
  import type { Writable } from "svelte/store";

  import DataSample from "./DataSample.svelte";
  import IconButton from "./IconButton.svelte";

  import Fa from "svelte-fa";
  import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
  import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

  export let defaultNumberShown: number = 20;
  export let dataPoints: Record<string, unknown>[];
  export let selected: Writable<string[]>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let tooltip: Writable<TooltipSpec>;

  let numberShown = defaultNumberShown;
</script>

<div class="flex flex-wrap items-center justify-between flex-1">
  <div class="flex flex-wrap">
    {#each dataPoints.slice(0, numberShown) as dataPoint}
      <DataSample {dataPoint} {symphonySpec} {selected} {tooltip} />
    {/each}
  </div>
  {#if dataPoints.length > numberShown}
    <IconButton on:click={() => (numberShown = dataPoints.length)}>
      <Fa icon={faEye} slot="icon" />
      <p slot="text">Show {dataPoints.length - defaultNumberShown} more</p>
    </IconButton>
  {/if}
  {#if dataPoints.length === numberShown && dataPoints.length > defaultNumberShown}
    <IconButton on:click={() => (numberShown = defaultNumberShown)}>
      <Fa icon={faEyeSlash} slot="icon" />
      <p slot="text">Collapse</p>
    </IconButton>
  {/if}
</div>
