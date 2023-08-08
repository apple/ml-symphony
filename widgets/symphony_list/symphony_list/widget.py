# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

from pathlib import Path

import symphony_ui
from traitlets import Unicode

from ._frontend import module_name, module_version


class SymphonyList(symphony_ui.SymphonyWidget):
    _model_name = Unicode(
        'SymphonyListModel').tag(sync=True)
    _view_name = Unicode(
        'SymphonyListView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    name = 'SymphonyList'
    description = "A Symphony component that displays a view of data instances"

    def __init__(self,
                 width: str = 'XXL',
                 height: str = 'M',
                 page: str = 'List',
                 **kwargs
                 ):
        """A Symphony component that displays a view of data instances

        Parameters
        ----------
        width : str, optional
            By default "XXL".
        height : str, optional
            By default "M".
        page : str, optional
            Which page of the dashboard to show the widget on, by default "SymphonyList"

        Returns
        -------
        SymphonyList
        """
        super().__init__(**kwargs)
        self.width: str = width
        self.height: str = height
        self.page: str = page
        self.spec = symphony_ui.WidgetSpec(
            width=width,
            height=height,
            page=page,
            name=self.name,
            description=self.description
        )

    def js_path(self):
        app_files_path = Path(
            (Path(__file__).parent), 'standalone', 'widgets')
        js_path = Path(app_files_path, 'SymphonyList.js')
        map_path = Path(
            app_files_path, 'SymphonyList.js.map')
        return js_path, map_path
