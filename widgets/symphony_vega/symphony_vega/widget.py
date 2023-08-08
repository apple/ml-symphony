# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

from pathlib import Path
from typing import List
from ._frontend import module_name, module_version

import symphony_ui
from traitlets import Unicode


class SymphonyVega(symphony_ui.SymphonyWidget):
    _model_name = Unicode('SymphonyVegaModel').tag(sync=True)
    _view_name = Unicode('SymphonyVegaView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    name = 'SymphonyVega'
    description = "A Symphony component that can be passed vega specs to be rendered"

    def __init__(self,
                 width: str = 'XXL',
                 height: str = 'M',
                 page: str = 'Vega',
                 vega_elements: List[dict] = [],
                 **kwargs):
        """A Symphony component that can be passed vega specs to be rendered

        Parameters
        ----------
        width : str, optional
            By default "XXL".
        height : str, optional
            By default "M".
        page : str, optional
            Which page of the dashboard to show the widget on, by default "Familiarity"
        vega_elements : List[dict], optional
            Vega charts to display, by default []

        Returns
        -------
        SymphonyVega
        """
        super().__init__(**kwargs)
        self.width: str = width
        self.height: str = height
        self.page: str = page
        self.vega_elements: List[dict] = vega_elements
        self.spec = symphony_ui.VegaSpec(
            width=width,
            height=height,
            page=page,
            name=self.name,
            description=self.description,
            vega_elements=vega_elements,
        )

    def js_path(self):
        app_files_path = Path(
            (Path(__file__).parent), 'standalone', 'widgets')
        js_path = Path(app_files_path, 'SymphonyVega.js')
        map_path = Path(app_files_path, 'SymphonyVega.js.map')
        return js_path, map_path
