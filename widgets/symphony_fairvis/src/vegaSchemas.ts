// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import type { VegaSpec, VegaLiteSpec } from 'svelte-vega';

export enum SchemaType {
  beeswarm,
  strip,
}

export function getSchema(
  type: SchemaType,
  width: number
): VegaSpec | VegaLiteSpec {
  if (type === SchemaType.beeswarm) {
    return {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description:
        'A beeswarm chart example that uses a force-directed layout to group items by category.',
      height: 100,
      width: 0.9 * width,
      padding: { left: 20, right: 20, top: 0, bottom: 20 },
      autosize: 'none',

      signals: [
        { name: 'cx', update: 'width / 2' },
        { name: 'cy', update: 'height / 2' },
        { name: 'radius', value: 8 },
        { name: 'collide', value: 1 },
        { name: 'gravityX', value: 0.2 },
        { name: 'gravityY', value: 0.1 },
        { name: 'static', value: false },
      ],
      data: [
        {
          name: 'table',
        },
      ],

      scales: [
        {
          name: 'xscale',
          type: 'linear',
          domain: [0, 1],
          range: 'width',
        },
        {
          name: 'color',
          type: 'linear',
          domain: { data: 'table', field: 'size' },
          range: { scheme: 'blues' },
        },
      ],

      axes: [{ orient: 'bottom', format: '0.0%', scale: 'xscale' }],

      marks: [
        {
          name: 'nodes',
          type: 'symbol',
          from: { data: 'table' },
          encode: {
            enter: {
              fill: { scale: 'color', field: 'size' },
              xfocus: { scale: 'xscale', field: 'metric' },
              yfocus: { signal: 'cy' },
              tooltip: {
                signal:
                  "{'group': datum.name, 'size': datum.size, 'rate' : format(datum.metric, '0.2%')}",
              },
            },
            update: {
              fill: { scale: 'color', field: 'size' },
              size: { signal: 'pow(2 * radius, 2)' },
              stroke: { value: 'white' },
              strokeWidth: { value: 1 },
              zindex: { value: 0 },
            },
            hover: {
              fill: { value: 'red' },
              zindex: { value: 1 },
            },
          },
          transform: [
            {
              type: 'force',
              iterations: 300,
              static: { signal: 'static' },
              forces: [
                {
                  force: 'collide',
                  iterations: { signal: 'collide' },
                  radius: { signal: 'radius' },
                },
                { force: 'x', x: 'xfocus', strength: { signal: 'gravityX' } },
                { force: 'y', y: 'yfocus', strength: { signal: 'gravityY' } },
              ],
            },
          ],
        },
      ],
    } as VegaSpec;
  }
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { name: 'table' },
    vconcat: [
      {
        width: 0.9 * width,
        height: 100,
        transform: [
          {
            joinaggregate: [
              {
                op: 'mean',
                field: 'metric',
                as: 'Average',
              },
            ],
          },
        ],
        layer: [
          {
            mark: { type: 'rect' },
            encoding: {
              x: {
                field: 'metric',
                type: 'quantitative',
                scale: {
                  domain: { param: 'brush' },
                },
                axis: {
                  format: '0.0%',
                  title: '',
                },
              },
              color: { field: 'size', type: 'quantitative', legend: null },
              tooltip: [
                { field: 'name', type: 'nominal', title: 'Group' },
                { field: 'size', type: 'quantitative', title: 'Size' },
                {
                  field: 'metric',
                  type: 'quantitative',
                  title: 'Rate',
                  format: '0.2%',
                },
              ],
            },
          },
          {
            mark: { type: 'rect', color: 'black' },
            encoding: {
              x: {
                aggregate: 'average',
                scale: {
                  domain: { param: 'brush' },
                },
                field: 'Average',
                type: 'quantitative',
                axis: {
                  format: '0.0%',
                },
              },
              tooltip: [
                {
                  field: 'Average',
                  type: 'quantitative',
                  title: 'Average Metric',
                  format: '0.2%',
                },
              ],
            },
          },
        ],
      },
      {
        width: 0.9 * width,
        height: 40,
        mark: { type: 'tick' },
        params: [
          {
            name: 'brush',
            select: { type: 'interval', encodings: ['x'] },
          },
        ],
        encoding: {
          x: {
            field: 'metric',
            type: 'quantitative',
            scale: {
              domain: [0, 1],
            },
            axis: {
              format: '0.0%',
              title: '',
            },
          },
          color: { field: 'size', type: 'quantitative', legend: null },
        },
      },
    ],
    config: { rect: { width: 5, align: 'center' }, tick: { bandSize: 30 } },
  } as VegaLiteSpec;
}
