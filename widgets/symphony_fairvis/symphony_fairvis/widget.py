# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

from pathlib import Path

import symphony_ui
from traitlets import Unicode

from ._frontend import module_name, module_version


class SymphonyFairVis(symphony_ui.SymphonyWidget):
    _model_name = Unicode(
        'SymphonyFairVisModel').tag(sync=True)
    _view_name = Unicode(
        'SymphonyFairVisView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    name = 'SymphonyFairVis'
    description = "A Symphony component to investigate fairness scores of subgroups"

    def __init__(self,
                 width: str = 'XXL',
                 height: str = 'M',
                 page: str = 'FairVis',
                 label_column: str = '',
                 prediction_column: str = '',
                 **kwargs
                 ):
        """A Symphony component to investigate fairness scores of subgroups

        Parameters
        ----------
        width : str, optional
            By default "XXL".
        height : str, optional
            By default "M".
        page : str, optional
            Which page of the dashboard to show the widget on, by default "SymphonyFairVis"
        label_column: str, optional
            The column with the instance label. By default empty.
        prediction_column: str, optional
            The column with the model's prediction. By default empty.

        Returns
        -------
        SymphonyFairVis
        """
        super().__init__(**kwargs)
        self.width: str = width
        self.height: str = height
        self.page: str = page
        self.spec = symphony_ui.ClassificationSpec(
            width=width,
            height=height,
            page=page,
            label_column=label_column,
            prediction_column=prediction_column,
            name=self.name,
            description=self.description
        )

    def js_path(self):
        app_files_path = Path(
            (Path(__file__).parent), 'standalone', 'widgets')
        js_path = Path(app_files_path, 'SymphonyFairVis.js')
        map_path = Path(
            app_files_path, 'SymphonyFairVis.js.map')
        return js_path, map_path
