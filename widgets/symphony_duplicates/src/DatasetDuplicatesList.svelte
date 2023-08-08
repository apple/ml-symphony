<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { SymphonySpec, TooltipSpec } from '@apple/symphony-lib';
  import type { Writable } from 'svelte/store';

  import {
    SampleRowContainer,
    Container,
    selectAll,
    IconButton,
  } from '@apple/symphony-lib';

  import Fa from 'svelte-fa';
  import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';

  export let dataPoints: Record<string, unknown>[];
  export let groupColumns: Writable<string[]>;
  export let groupNames: Writable<string[][]>;
  export let selected: Writable<string[]>;
  export let symphonySpec: Writable<SymphonySpec>;
  export let tooltip: Writable<TooltipSpec>;
  export let defaultNumberShown: number;
  export let candidatesGroupNumber: number;

  $: filteredPoints = $groupNames
    .map((attrs: string[]) => {
      return {
        attrs: attrs,
        points: dataPoints.filter((point: Record<string, unknown>) => {
          let match = true;
          attrs.forEach((attr, i) => {
            if (point[$groupColumns[i]] !== attr) match = false;
          });
          return match;
        }),
      };
    })
    .sort((a, b) => b.points.length - a.points.length);
</script>

<div w-full>
  {#if $groupNames.length === 0}
    <Container>
      <div class="flex items-top justify-between w-full" slot="header">
        <h3 class="font-bold whitespace-nowrap mr-3">
          {`Candidate Group ${candidatesGroupNumber}`}
        </h3>
        <IconButton
          on:click={() => {
            selectAll(
              selected,
              dataPoints.map((d) => d[$symphonySpec.idColumn])
            );
          }}
        >
          <Fa icon={faCheckSquare} slot="icon" />
        </IconButton>
      </div>
      <div class="flex" slot="content">
        <SampleRowContainer {dataPoints} {selected} {symphonySpec} {tooltip} />
      </div>
    </Container>
  {:else}
    <Container>
      <div class="flex items-top justify-between w-full" slot="header">
        <h3 class="font-bold whitespace-nowrap mr-3">
          {`Candidate Group ${candidatesGroupNumber}`}
        </h3>
        <IconButton
          on:click={() => {
            selectAll(
              selected,
              dataPoints.map((d) => d[$symphonySpec.idColumn])
            );
          }}
        >
          <Fa icon={faCheckSquare} slot="icon" />
        </IconButton>
      </div>
      <div slot="content">
        {#each filteredPoints as group, i}
          {#if group.points.length !== 0}
            <div class="flex items-center">
              <h3 class="whitespace-nowrap italic">
                {group.attrs.join(' | ')}
              </h3>
            </div>
            <SampleRowContainer
              {defaultNumberShown}
              dataPoints={group.points}
              {symphonySpec}
              {selected}
              {tooltip}
            />
          {/if}
        {/each}
      </div>
    </Container>
  {/if}
</div>
