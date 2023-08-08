# Symphony Summary Widget

A component that displays an overview of the provided dataset table.
To configure it, pass a list of `SummaryElement`.
One `SummaryElement` is defined as:

```
export interface SummaryElement {
    name: string;
    data: number | ChartData;
}
```

`ChartData` is defined as:

```
export interface ChartData {
    spec: VegaLiteSpec;
    data: Record<string, unknown>;
}
```

## Installation

```bash
pip install symphony_summary
```

## Usage

To learn how to use Symphony, see the [documentation](https://apple.github.io/ml-symphony/).

## Development

To learn about how to build Symphony from source and how to contribute to the framework, please look at [CONTRIBUTING.md](../CONTRIBUTING.md) and the [development documentation](https://apple.github.io/ml-symphony/contributing.html).
