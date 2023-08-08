<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import ToggleButton from "../src/elements/ToggleButton.svelte";
  import "./utils.css";
</script>

<Meta
  title="ToggleButton"
  component={ToggleButton}
  argTypes={{
    title: { control: "text" },
    active: { control: "boolean" },
  }}
/>

<Template let:args>
  <ToggleButton {...args} />
</Template>

<Story
  name="Default"
  args={{
    title: "test",
    active: false,
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
