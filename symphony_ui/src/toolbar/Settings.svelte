<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { SymphonySpec } from '@apple/symphony-lib';

  import { SubHeading, ToggleButton, NumberInput } from '@apple/symphony-lib';

  export let symphonySpec: Writable<SymphonySpec>;

  let showUnfilteredData = $symphonySpec.showUnfilteredData;
  let instancesPerPage = $symphonySpec.instancesPerPage;

  $: symphonySpec.update((spec) => {
    spec.showUnfilteredData = showUnfilteredData;
    spec.instancesPerPage = instancesPerPage;
    return { ...spec };
  });
</script>

<div class="flex flex-col">
  <div class="px-2 pt-2">
    <SubHeading heading={'Settings'} />
  </div>
  <div class="p-2 flex flex-col">
    <ToggleButton
      title="Show unfiltered charts"
      bind:active={showUnfilteredData}
    />
    <div class="pt-1">
      <NumberInput title="Samples per page" bind:value={instancesPerPage} />
    </div>
  </div>
</div>
