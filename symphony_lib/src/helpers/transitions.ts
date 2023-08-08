// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import type { SlideParams, TransitionConfig } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

export function slide(
  node: Element,
  { delay = 0, duration = 400, easing = cubicOut }: SlideParams = {}
): TransitionConfig {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const width = parseFloat(style.width);
  const padding_right = parseFloat(style.paddingRight);
  const padding_left = parseFloat(style.paddingLeft);
  const margin_right = parseFloat(style.marginRight);
  const margin_left = parseFloat(style.marginLeft);
  const border_right_width = parseFloat(style.borderRightWidth);
  const border_left_width = parseFloat(style.borderLeftWidth);

  return {
    delay,
    duration,
    easing,
    css: (t) =>
      'overflow: hidden;' +
      `opacity: ${Math.min(t * 20, 1) * opacity};` +
      `width: ${t * width}px;` +
      `padding-right: ${t * padding_right}px;` +
      `padding-left: ${t * padding_left}px;` +
      `margin-right: ${t * margin_right}px;` +
      `margin-left: ${t * margin_left}px;` +
      `border-right-width: ${t * border_right_width}px;` +
      `border-left-width: ${t * border_left_width}px;`,
  };
}
