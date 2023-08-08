// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { DOMWidgetModel, ISerializers } from "@jupyter-widgets/base";
export * from "./types";
export * from "./elements";
export * from "./helpers";
export * from "./stores";
export { default as JupyterWidget } from "./JupyterWidget.svelte";

export const serializers: ISerializers = {
  ...DOMWidgetModel.serializers,
  table: {
    serialize: (value: any): DataView => {
      return new DataView(value.buffer.slice(0));
    },
  },
};
