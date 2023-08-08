// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import type { VegaLiteSpec } from 'svelte-vega';
import type ColumnTable from 'arquero/dist/types/table/column-table';

import {
  QueryElement,
  ResolverType,
  SummaryElement,
} from '@apple/symphony-lib';

import {
  isStringColumnBinnable,
  getBinnableStringColumns,
  getColumnType,
} from '@apple/symphony-lib';

import { faAlignJustify } from '@fortawesome/free-solid-svg-icons/faAlignJustify';
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons/faLayerGroup';

export function extractColumnElements(table: ColumnTable): SummaryElement[] {
  const summaryElements: SummaryElement[] = [];
  summaryElements.push({
    name: '# of Instances',
    data: table.numRows(),
  });
  const colNames = table.columnNames();
  for (const colName of colNames) {
    const columnType = getColumnType(table, colName);
    if (columnType === 'number') {
      if (colName.startsWith('duplicates_')) {
        summaryElements.push(getTotalNonNegativeElements(colName, table));
      } else if (!colName.startsWith('projection_')) {
        summaryElements.push({
          name: colName,
          data: {
            spec: getNumberColumnSpec(colName),
            data: { values: 'arrow_table' },
            resolver: {
              type: ResolverType.NUMBER,
              columnName: colName,
            },
          },
        });
      }
    } else if (columnType === 'string') {
      if (isStringColumnBinnable(colName, table)) {
        summaryElements.unshift({
          name: colName,
          data: {
            spec: getBinnedStringColumnSpec(colName),
            data: { values: 'arrow_table' },
            resolver: {
              type: ResolverType.BINNED_STRING,
              columnName: colName,
            },
          },
        });
      }
    }
  }
  return summaryElements;
}

export function getQueryTree(table: ColumnTable): QueryElement {
  return {
    name: 'init',
    next: [tableQueryElement, ...getQueryElementsFromTable(table)],
  };
}

function getNumberColumnSpec(columnName: string): VegaLiteSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: `${columnName} binned`,
    data: { values: 'values' },
    mark: { type: 'bar', tooltip: true },
    encoding: {
      x: {
        field: 'bin_0',
        title: 'value',
      },
      y: { field: 'count', type: 'quantitative', title: 'instances' },
    },
  };
}

function getBinnedStringColumnSpec(columnName: string): VegaLiteSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: `${columnName} distribution`,
    data: { name: 'values' },
    mark: { type: 'bar', tooltip: true, cursor: 'pointer' },
    encoding: {
      y: { field: columnName, type: 'nominal', sort: '-x' },
      x: {
        field: 'count',
        type: 'quantitative',
        title: 'instances',
      },
    },
  };
}

function getQueryElementsFromTable(table: ColumnTable): QueryElement[] {
  const elements: QueryElement[] = [];
  for (const columnName of table.columnNames()) {
    const type = getColumnType(table, columnName);
    switch (type) {
      case 'number':
        elements.push(getNumberQueryElement(table, columnName));
        break;
      case 'string':
        if (isStringColumnBinnable(columnName, table)) {
          elements.push(getStringQueryElement(table, columnName));
        }
        break;
      case 'array':
        if (getBinnableStringColumns(table).length > 0) {
          elements.push(getArrayQueryElement(table, columnName));
        }
        break;
      default:
        break;
    }
  }
  return elements;
}

const tableQueryElement: QueryElement = {
  name: 'table',
  icon: faTable,
  next: [
    {
      name: 'numRows',
      next: (names: string[], table: ColumnTable) => {
        return { name: '# of Instances', data: table.numRows() };
      },
    },
  ],
};

function getNumberQueryElement(
  table: ColumnTable,
  columnName: string
): QueryElement {
  return {
    name: columnName,
    icon: faListOl,
    next: [
      {
        name: 'histogram',
        next: (names: string[], table: ColumnTable) => {
          return {
            name: columnName,
            data: {
              spec: getNumberColumnSpec(columnName),
              data: { values: 'arrow_table' },
              resolver: {
                type: ResolverType.NUMBER,
                columnName: columnName,
              },
            },
          };
        },
      },
      {
        name: 'non-negative',
        next: getNonNegativeNumberQueryElements(table),
      },
    ],
  };
}

function getNonNegativeNumberQueryElements(table: ColumnTable): QueryElement[] {
  const elements: QueryElement[] = [];
  elements.push({
    name: 'total',
    next: (names: string[], table: ColumnTable) =>
      getTotalNonNegativeElements(names[0], table),
  });
  for (const column of getBinnableStringColumns(table)) {
    elements.push({
      name: `by ${column}`,
      next: (names: string[], table: ColumnTable) => {
        return {
          name: 'Nonempty List',
          data: {
            spec: {
              $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
              title: `${names[0]} per ${column}`,
              description: `Bar chart visualizing the distribution of ${names[0]} per ${column}.`,
              transform: [
                {
                  filter: `datum.${names[0]} >= 0`,
                },
              ],
              data: { name: 'values' },
              mark: { type: 'bar', tooltip: true },
              encoding: {
                y: { field: column, type: 'nominal', title: column },
                x: {
                  aggregate: 'count',
                  type: 'quantitative',
                  title: names[0],
                },
              },
            },
            data: {
              values: 'arrow_table',
            },
          },
        };
      },
    });
  }
  return elements;
}

function getTotalNonNegativeElements(
  columnName: string,
  table: ColumnTable
): SummaryElement {
  const column = table.array(columnName);
  let nonNegativeElements = 0;
  column.forEach((element) => {
    if (element >= 0) {
      nonNegativeElements++;
    }
  });
  return {
    name: columnName,
    data: nonNegativeElements,
  };
}

function getStringQueryElement(
  table: ColumnTable,
  columnName: string
): QueryElement {
  return {
    name: columnName,
    icon: faAlignJustify,
    next: [
      {
        name: 'histogram',
        next: (names: string[], table: ColumnTable) => {
          return {
            name: columnName,
            data: {
              spec: getBinnedStringColumnSpec(columnName),
              data: { values: 'arrow_table' },
              resolver: {
                type: ResolverType.BINNED_STRING,
                columnName: columnName,
              },
            },
          };
        },
      },
    ],
  };
}

function getArrayQueryElement(
  table: ColumnTable,
  columnName: string
): QueryElement {
  return {
    name: columnName,
    icon: faLayerGroup,
    next: [
      {
        name: 'not empty',
        next: getArrayBinQueryElements(table),
      },
    ],
  };
}

function getArrayBinQueryElements(table: ColumnTable): QueryElement[] {
  const elements: QueryElement[] = [];
  for (const column of getBinnableStringColumns(table)) {
    elements.push({
      name: `bin by ${column}`,
      next: (names: string[], table: ColumnTable) => {
        return {
          name: 'Nonempty List',
          data: {
            spec: {
              $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
              title: `${names[0]} per ${column}`,
              description: `Bar chart visualizing the distribution of ${names[0]} per ${column}.`,
              transform: [
                {
                  filter: `length(datum.${names[0]}) > 0`,
                },
              ],
              data: { name: 'values' },
              mark: { type: 'bar', tooltip: true },
              encoding: {
                y: { field: column, type: 'nominal', title: column },
                x: {
                  aggregate: 'count',
                  type: 'quantitative',
                  title: names[0],
                },
              },
            },
            data: {
              values: 'arrow_table',
            },
          },
        };
      },
    });
  }
  return elements;
}
