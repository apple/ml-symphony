# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

import json
import shutil
from pathlib import Path

from ipywidgets import DOMWidget
from traitlets import Dict, List, Unicode

from ._helpers import CByteMemoryView

from ._frontend import module_name, module_version


class SymphonyWidget(DOMWidget):
    """Generic SymphonyWidget for all Symphony widgets."""
    symphony_spec = Dict().tag(sync=True)
    widget_spec = Dict().tag(sync=True)
    table = CByteMemoryView().tag(sync=True)
    selected = List([]).tag(sync=True)
    filter = Unicode('').tag(sync=True)
    group_columns = List([]).tag(sync=True)

    def export(self, export_path):
        name = self.widget_spec['name']
        data_path = Path(export_path, 'data')
        result_path = Path(data_path, f'{name}.json')
        with open(result_path, 'w') as data_file:
            json.dump(self.widget_spec, data_file)
        js_path, map_path = self.js_path()
        try:
            shutil.copy(js_path, Path(export_path, 'widgets'))
        except shutil.SameFileError:
            pass
        try:
            shutil.copy(map_path, Path(export_path, 'widgets'))
        except (shutil.SameFileError, FileNotFoundError) as _:
            pass

        return {
            "name": name,
            "file": f'{name}.json',
            "height": self.widget_spec['height'],
            "width": self.widget_spec['width'],
            "page": self.widget_spec['page'],
        }

    def js_path(self):
        pass


class ToolbarWidget(SymphonyWidget):
    _model_name = Unicode('ToolbarModel').tag(sync=True)
    _view_name = Unicode('ToolbarView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
