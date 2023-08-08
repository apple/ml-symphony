// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { SymphonyDataType } from "../types";

import ImageSample from "../elements/ImageSample.svelte";
import AudioSample from "../elements/AudioSample.svelte";
import TabularSample from "../elements/TabularSample.svelte";

export function getComponentForType(type: SymphonyDataType) {
  switch (type) {
    case SymphonyDataType.AUDIO:
      return AudioSample;
    case SymphonyDataType.IMAGE:
      return ImageSample;
    default:
      return TabularSample;
  }
}
