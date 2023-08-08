# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

from pathlib import Path

import symphony_ui
from traitlets import Unicode

from ._frontend import module_name, module_version
from ._default_codes import codes


class SymphonyDataMap(symphony_ui.SymphonyWidget):
    _model_name = Unicode(
        'SymphonyDataMapModel').tag(sync=True)
    _view_name = Unicode(
        'SymphonyDataMapView').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    name = 'SymphonyDataMap'
    description = "A Symphony component for visualizing data on a map"

    def __init__(self,
                 width: str = 'XXL',
                 height: str = 'M',
                 page: str = 'Data Map',
                 projection: str = 'mercator',
                 id_map: dict = codes,
                 feature: str = 'countries',
                 id_column: str = 'country',
                 map_url: str = 'https://raw.githubusercontent.com/vega/datalib/master/test/data/world-110m.json',
                 ** kwargs
                 ):
        """A Symphony component for visualizing data on a map

        Parameters
        ----------
        width : str, optional
            By default "XXL".
        height : str, optional
            By default "M".
        page : str, optional
            Which page of the dashboard to show the widget on, by default "SymphonyDataMap"

        Returns
        -------
        SymphonyDataMap
        """
        super().__init__(**kwargs)
        self.width: str = width
        self.height: str = height
        self.page: str = page
        self.spec = symphony_ui.DataMapSpec(
            width=width,
            height=height,
            page=page,
            name=self.name,
            description=self.description,
            projection=projection,
            id_map=id_map,
            feature=feature,
            id_column=id_column,
            map_url=map_url
        )

    def js_path(self):
        app_files_path = Path(
            (Path(__file__).parent), 'standalone', 'widgets')
        js_path = Path(app_files_path, 'SymphonyDataMap.js')
        map_path = Path(
            app_files_path, 'SymphonyDataMap.js.map')
        return js_path, map_path
