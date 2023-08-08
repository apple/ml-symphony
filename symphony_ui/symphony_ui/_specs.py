# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

from dataclasses import dataclass
from enum import Enum
from typing import List, Union


class SymphonyDataType(Enum):
    TABULAR = 1
    IMAGE = 2
    AUDIO = 3


@dataclass
class WidgetSpec():
    width: str
    height: str
    page: str
    name: str
    description: str


@dataclass
class ClassificationSpec(WidgetSpec):
    label_column: str = ''
    prediction_column: str = ''


@dataclass
class MarkdownSpec(WidgetSpec):
    content: str = ''
    title: str = ''


@dataclass
class VegaSpec(WidgetSpec):
    vega_elements: List[dict]


@dataclass
class DataMapSpec(WidgetSpec):
    projection: str
    id_map: dict
    feature: str
    id_column: str
    map_url: str


@dataclass
class SummaryElement():
    name: str
    data: Union[dict, int, float]


@dataclass
class SymphonySummarySpec(WidgetSpec):
    summary_elements: List[SummaryElement]


@dataclass
class SymphonySpec():
    files_path: str
    data_type: int
    instances_per_page: int
    show_unfiltered_data: bool
    id_column: str = 'id'
