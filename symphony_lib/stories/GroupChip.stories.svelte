<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import GroupChip from "../src/elements/GroupChip.svelte";
  import "./utils.css";
</script>

<Meta
  title="GroupChip"
  component={GroupChip}
  argTypes={{
    groupSize: { control: "number" },
  }}
/>

<Template let:args>
  <GroupChip {...args} />
</Template>

<Story
  name="Default"
  args={{
    groupSize: 100,
    values: ["category1", "category2", "category3"],
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
