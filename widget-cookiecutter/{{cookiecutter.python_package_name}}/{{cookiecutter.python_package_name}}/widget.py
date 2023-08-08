# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

# Widget created by {{cookiecutter.author_name}}, {{cookiecutter.year}}.

from pathlib import Path

import symphony_ui
from traitlets import Unicode

from ._frontend import module_name, module_version


class {{cookiecutter.widget_identifier}}(symphony_ui.SymphonyWidget):
    _model_name = Unicode(
        '{{cookiecutter.widget_identifier}}Model').tag(sync=True)
    _view_name = Unicode(
        '{{cookiecutter.widget_identifier}}View').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    name = '{{cookiecutter.widget_identifier}}'
    description = "{{cookiecutter.project_short_description}}"

    def __init__(self,
                 width: str = 'XXL',
                 height: str = 'M',
                 page: str = '{{cookiecutter.widget_name}}',
                 **kwargs
                 ):
        """{{cookiecutter.project_short_description}}

        Parameters
        ----------
        width : str, optional
            By default "XXL".
        height : str, optional
            By default "M".
        page : str, optional
            Which page of the dashboard to show the widget on, by default "{{cookiecutter.widget_identifier}}"

        Returns
        -------
        {{cookiecutter.widget_identifier}}
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
        js_path = Path(app_files_path, '{{cookiecutter.widget_identifier}}.js')
        map_path = Path(
            app_files_path, '{{cookiecutter.widget_identifier}}.js.map')
        return js_path, map_path
