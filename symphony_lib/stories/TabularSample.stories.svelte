<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import TabularSample from "../src/elements/TabularSample.svelte";
  import "./utils.css";
</script>

<Meta title="TabularSample" component={TabularSample} argTypes={{}} />

<Template let:args>
  <div>
    <TabularSample {...args} />
  </div>
</Template>

<Story name="Default" args={{}} />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
