# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

from pathlib import Path
from typing import List
from ._frontend import module_name, module_version

import symphony_ui
from traitlets import Unicode


class SymphonySummary(symphony_ui.SymphonyWidget):
    _model_name = Unicode('SymphonySummaryModel').tag(sync=True)
    _view_name = Unicode('SymphonySummaryView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    name = 'SymphonySummary'
    description = "A Symphony component that visualizes an overview of a dataset"

    def __init__(self,
                 width: str = 'XXL',
                 height: str = 'M',
                 page: str = 'Summary',
                 summary_elements: List[symphony_ui.SummaryElement] = [],
                 **kwargs):
        """A Symphony component that visualizes an overview of a dataset

        Parameters
        ----------
        width : str, optional
            By default "XXL".
        height : str, optional
            By default "M".
        page : str, optional
            Which page of the dashboard to show the widget on, by default "Familiarity"
        summary_elements : List[SummaryElement], optional
            Vega charts or metrics to display, by default []

        Returns
        -------
        SymphonySummary
        """
        super().__init__(**kwargs)
        self.width: str = width
        self.height: str = height
        self.page: str = page
        self.summary_elements: List[symphony_ui.SummaryElement] = summary_elements
        self.spec = symphony_ui.SymphonySummarySpec(
            width=width,
            height=height,
            page=page,
            name=self.name,
            description=self.description,
            summary_elements=summary_elements,
        )

    def js_path(self):
        app_files_path = Path(
            (Path(__file__).parent), 'standalone', 'widgets')
        js_path = Path(app_files_path, 'SymphonySummary.js')
        map_path = Path(app_files_path, 'SymphonySummary.js.map')
        return js_path, map_path
