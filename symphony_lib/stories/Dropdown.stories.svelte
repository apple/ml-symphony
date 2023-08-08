<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Dropdown from "../src/elements/Dropdown.svelte";
  import "./utils.css";
</script>

<Meta
  title="Dropdown"
  component={Dropdown}
  argTypes={{
    value: {
      control: { type: "select", options: ["value1", "value2", "value3"] },
    },
  }}
/>

<Template let:args>
  <Dropdown {...args} />
</Template>

<Story
  name="Default"
  args={{
    value: "value1",
    items: ["value1", "value2", "value3"],
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
