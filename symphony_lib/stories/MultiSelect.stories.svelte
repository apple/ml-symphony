<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import MultiSelect from "../src/elements/MultiSelect.svelte";
  import "./utils.css";
</script>

<Meta
  title="MultiSelect"
  component={MultiSelect}
  argTypes={{
    value: {
      control: {
        type: "multi-select",
        options: ["value1", "value2", "value3"],
      },
    },
    placeholder: { control: "text" },
  }}
/>

<Template let:args>
  <MultiSelect {...args} />
</Template>

<Story
  name="Default"
  args={{
    value: "value1",
    placeholder: "placeholder",
    items: ["value1", "value2", "value3"],
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
