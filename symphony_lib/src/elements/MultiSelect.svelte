<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script lang="ts">
  import Select from "svelte-select";

  export let placeholder: string;
  export let items: string[];
  export let value: string[];
</script>

<Select {value} {placeholder} {items} isMulti={true} on:select on:clear />
