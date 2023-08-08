<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import Fa from "svelte-fa";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";

  import IconButton from "./IconButton.svelte";
</script>

<div>
  <IconButton
    on:click={() =>
      window.open("https://github.com/apple/ml-symphony", "_blank")}
    filled={true}
  >
    <Fa icon={faGithub} slot="icon" />
    <span slot="text">Use Symphony</span>
  </IconButton>
</div>
