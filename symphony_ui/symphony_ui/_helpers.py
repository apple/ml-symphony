# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

"""Helper functions for creating Symphony widgets"""
from __future__ import absolute_import

import http.server
import os
import re
import socketserver
from dataclasses import asdict
from pathlib import Path

import pandas as pd
import pyarrow as pa
from traitlets import TraitType
from typing import Union

from ._specs import SymphonyDataType


def to_arrow_file(table: Union[pa.Table, pd.DataFrame], export_path: Union[str, Path]):
    """Save a PyArrow or Pandas table as a .arrow file.
    Parameters
    ----------
    table : pa.Table or pd.DataFrame
        A Pandas DataFrame, Apache Arrow table with metadata columns.
    export_path : Union[str,Path]
        Where to save the file to.
    """
    export_path = Path(export_path)
    if isinstance(table, pd.DataFrame):
        table = pa.Table.from_pandas(table)
    table_to_file(table, Path(export_path, 'table.arrow'))


def table_to_file(table, path):
    sink = path
    writer = pa.ipc.new_file(sink, table.schema)
    writer.write(table)
    writer.close()


def serialize_table(table: pa.Table):
    sink = pa.BufferOutputStream()
    writer = pa.RecordBatchStreamWriter(sink, table.schema)
    writer.write_table(table)
    writer.close()
    return sink.getvalue().to_pybytes()


def deserialize_table(data):
    reader = pa.RecordBatchStreamReader(data)
    table = reader.read_all()
    return table


def get_data_type(type: SymphonyDataType, id: str):
    if type:
        return type

    if id[-3:] == 'wav':
        return SymphonyDataType.AUDIO
    elif id[-3:] == 'png' or id[-3:] == 'jpg' or id[-3:] == 'bmp' or id[-4:] == 'jpeg' or id[-3:] == 'tif' or id[-4:] == 'tiff':
        return SymphonyDataType.IMAGE
    else:
        return SymphonyDataType.TABULAR


def get_num_instances_by_data_type(instancesPerPage: int, type: SymphonyDataType):
    if instancesPerPage:
        return instancesPerPage

    if type == SymphonyDataType.AUDIO:
        return 20
    elif type == SymphonyDataType.IMAGE:
        return 150
    else:
        return 150


def dataclass_to_camel_dict(spec):
    """Convert dataclass to """
    spec_dict = asdict(spec)
    new_dict = {}
    for key in spec_dict:
        new_key = ''.join([word.title() for word in key.split('_')])
        new_key = new_key[0].lower() + new_key[1:]
        new_dict[new_key] = spec_dict[key]
    return new_dict


def camel_dict_to_snake_case_dict(spec_dict: dict):
    new_dict = {}
    for key in spec_dict:
        new_key = re.sub(r'(?<!^)(?=[A-Z])', '_', key).lower()
        new_dict[new_key] = spec_dict[key]
    return new_dict


class ByteMemoryView(TraitType):
    """A trait for memory views of bytes."""

    default_value = memoryview(b'')
    info_text = 'a memory view object'

    def validate(self, obj, value):
        if isinstance(value, memoryview) and value.format == 'B':
            return value
        self.error(obj, value)

    def default_value_repr(self):
        return repr(self.default_value.tobytes())


class CByteMemoryView(ByteMemoryView):
    """A casting version of the byte memory view trait."""

    def validate(self, obj, value):
        if isinstance(value, memoryview) and value.format == 'B':
            return value

        try:
            mv = memoryview(value)
            if mv.format != 'B':
                mv = mv.cast('B')
            return mv
        except Exception:
            self.error(obj, value)
