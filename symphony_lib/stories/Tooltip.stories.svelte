<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Tooltip from "../src/elements/Tooltip.svelte";
  import "./utils.css";
</script>

<Meta
  title="Tooltip"
  component={Tooltip}
  argTypes={{
    text: { control: "text" },
    active: { control: "boolean" },
  }}
/>

<Template let:args>
  <Tooltip {...args} />
</Template>

<Story
  name="Default"
  args={{
    text: "Text for a tooltip.",
    active: true,
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
