<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import Heading from "./Heading.svelte";
  import IconButton from "./IconButton.svelte";

  import { exportView } from "../helpers/export";

  import Fa from "svelte-fa";
  import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";

  export let title: string;
  export let description: string;
  export let container: HTMLDivElement;
</script>

<div class="flex items-top justify-between">
  <div class="flex flex-wrap">
    <Heading heading={title} {description} />
    <div class="flex flex-wrap">
      <slot />
    </div>
  </div>
  <div class="pb-3 pl-3">
    <IconButton on:click={() => exportView(container, "Scatterplot")}>
      <Fa icon={faImage} slot="icon" />
      <span slot="text">Download</span>
    </IconButton>
  </div>
</div>
