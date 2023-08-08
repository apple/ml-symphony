<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import type { SymphonySpec } from "../types";
  import type { Writable } from "svelte/store";
  import { join } from "@fireflysemantics/join";

  export let id: string;
  export let symphonySpec: Writable<SymphonySpec>;
  export let large: boolean = false;
</script>

<div>
  <img
    src={join($symphonySpec.filesPath, id)}
    alt={"Image with title: " + id}
    class={large ? "mx-1" : "w-12 m-1"}
    style="background: black; max-width: 250px"
    on:click
  />
</div>
