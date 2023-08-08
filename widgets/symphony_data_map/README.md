# SymphonyDataMap

A rendered map where landmarks are colored by another variable.
To configure the map, the spec of this component is defined as follows:

```
@dataclass
class DataMapSpec(WidgetSpec):
    projection: str
    id_map: dict
    feature: str
    id_column: str
    map_url: str
```

The projection is a `vega-projection`, the `id_map` maps names to multiple `id` in a TopoJSON, the `feature` defines what column to color by, the `id_column` defines where names are to be found, and the `map_url` provides a link to the appropriate TopoJSON.

## Installation

```bash
pip install symphony_data_map
```

## Usage

To learn how to use Symphony, see the [documentation](https://apple.github.io/ml-symphony/).

## Development

To learn about how to build Symphony from source and how to contribute to the framework, please look at [CONTRIBUTING.md](../CONTRIBUTING.md) and the [development documentation](https://apple.github.io/ml-symphony/contributing.html).
