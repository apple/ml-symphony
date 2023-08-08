<!-- For licensing see accompanying LICENSE file.
Copyright (C) 2023 Apple Inc. All Rights Reserved. -->

<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Container from "../src/elements/Container.svelte";
  import "./utils.css";
</script>

<Meta
  title="Container"
  component={Container}
  argTypes={{
    title: { control: "text" },
  }}
/>

<Template let:args>
  <Container {...args}>
    <div slot="content">
      <span>A container can hold other components via a slot named </span>
      <code>content</code>
    </div>
  </Container>
</Template>

<Story
  name="Default"
  args={{
    title: "test",
    categories: ["category1", "category2", "category3"],
  }}
/>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
