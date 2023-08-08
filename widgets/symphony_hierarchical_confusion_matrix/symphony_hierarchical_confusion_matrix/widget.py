# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

from pathlib import Path

import symphony_ui
from traitlets import Unicode

from ._frontend import module_name, module_version


class SymphonyHierarchicalConfusionMatrix(symphony_ui.SymphonyWidget):
    _model_name = Unicode(
        'SymphonyHierarchicalConfusionMatrixModel').tag(sync=True)
    _view_name = Unicode(
        'SymphonyHierarchicalConfusionMatrixView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    name = 'SymphonyHierarchicalConfusionMatrix'
    description = "A confusion matrix Symphony component that can display hierarchical labels"

    def __init__(self,
                 width: str = 'XXL',
                 height: str = 'M',
                 page: str = 'Hierarchical Confusion Matrix',
                 label_column: str = '',
                 prediction_column: str = '',
                 **kwargs
                 ):
        """A confusion matrix Symphony component that can display hierarchical labels

        Parameters
        ----------
        width : str, optional
            By default "XXL".
        height : str, optional
            By default "M".
        page : str, optional
            Which page of the dashboard to show the widget on, by default "SymphonyHierarchicalConfusionMatrix"
        label_column: str, optional
            The column with the instance label. By default empty.
        prediction_column: str, optional
            The column with the model's prediction. By default empty.

        Returns
        -------
        SymphonyHierarchicalConfusionMatrix
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
        js_path = Path(
            app_files_path, 'SymphonyHierarchicalConfusionMatrix.js')
        map_path = Path(
            app_files_path, 'SymphonyHierarchicalConfusionMatrix.js.map')
        return js_path, map_path
