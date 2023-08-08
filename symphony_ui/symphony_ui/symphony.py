"""Symphony class"""
# coding: utf-8

# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

import json
import os
import shutil
import uuid
import webbrowser
from multiprocessing import Process
from pathlib import Path
from string import Template
from typing import Dict, List, Type, Union

import requests
import pandas as pd
import pyarrow as pa
from ipywidgets import HBox, jsdlink, jslink
from ipywidgets.widgets.widget_layout import Layout

from ._helpers import (camel_dict_to_snake_case_dict, dataclass_to_camel_dict,
                       deserialize_table, get_data_type,
                       get_num_instances_by_data_type, serialize_table, table_to_file)
from ._specs import SymphonyDataType, SymphonySpec
from ._widgets import SymphonyWidget, ToolbarWidget

TOOLBAR_LAYOUT = Layout(overflow='unset')
WIDGET_LAYOUT = Layout(overflow='unset', width='100%')


class Symphony:
    """A framework for modular, interactive data science visualizations.
       Symphony provides a collection of widgets users can use to explore their data both in
       Jupyter Notebooks and standalone web dashboards."""

    def __init__(self,
                 table: Union[pa.Table, pd.DataFrame, str],
                 id_column: str = "id",
                 files_path: str = None,
                 data_type: SymphonyDataType = None,
                 instances_per_page: int = None,
                 notebook: bool = False):
        """
        Parameters
        ----------
        table : pa.Table or pd.DataFrame or str
            A Pandas DataFrame, Apache Arrow table, or a link to a :code:`.arrow` file with metadata columns (a :code:`.arrow` file can be obtained using the :code:`to_arrow_file` function).
        id_column : str, optional
            Name of the identifier column, by default :code:`id`.
        files_path : str, optional
            A file path or URL for fetching non-tabular data instances.
            The path must be relative to the root directory of the Jupyter Notebook or Lab.
        data_type : str, optional
            The type of the data passed to Symphony.
            Currently supports :code:`image` and :code:`audio`.
            If None, Symphony will try to infer the type from the id column extension.
        instances_per_page: str, optional
            How many instances each page in a widget should show.
            If :code:`None`, Symphony will select a sensible default given the selected data type.
        notebook : bool, optional
            If true, the data path is updated to use the Jupyter Notebook fileserver, by default :code:`True`.
        """
        self._application = None
        self._notebook = notebook
        self._files_path = files_path
        self._table_link = None

        if isinstance(table, str):
            self._table_link = table
            request = requests.get(self._table_link, stream=True)
            reader = pa.ipc.open_file(request.raw.read())
            table = reader.read_all()

        if isinstance(table, pd.DataFrame):
            table = pa.Table.from_pandas(table)

        if table.shape[0] < 1:
            print('Must have at least one row in the table, not initializing Symphony.')
            return

        self._jupyter_files_path = self._files_path
        if notebook and self._files_path is not None:
            self._jupyter_files_path = os.path.join(
                '/files/', self._files_path)

        if files_path is not None:
            self._data_type = get_data_type(
                data_type, table.slice(0, 1)[id_column].to_numpy()[0])
        else:
            self._data_type = SymphonyDataType.TABULAR

        self._symphony_spec = SymphonySpec(
            files_path=str(self._jupyter_files_path),
            data_type=self._data_type.value,
            id_column=id_column,
            instances_per_page=get_num_instances_by_data_type(
                instances_per_page, self._data_type),
            show_unfiltered_data=True
        )

        # Dict of {'name': Widget} to cache widgets.
        self._widgets = {}

        # ToolbarWidget is available for everyone and holds general functionality.
        self._toolbar_widget = ToolbarWidget(layout=TOOLBAR_LAYOUT)
        self._toolbar_widget.instances_per_page = self._symphony_spec.instances_per_page
        self._toolbar_widget.widget_spec = {'name': 'toolbar'}
        self._toolbar_widget.symphony_spec = dataclass_to_camel_dict(
            self._symphony_spec)
        self._toolbar_widget.table = serialize_table(table)

    def __del__(self):
        try:
            if self._application:
                self._application.terminate()
        except:
            pass

    def widget(self, widget: Type[SymphonyWidget], **kwargs) -> HBox:
        """Render a SymphonyWidget.

        Parameters
        ----------
        widget: Type[SymphonyWidget]
            The widget to be added to symphony.

        Returns
        -------
        HBox
            Notebook container for toolbar and created widget.
        """
        existing_widget = self._widgets.get(widget.name)
        if existing_widget:
            return HBox([existing_widget, self._toolbar_widget], layout=WIDGET_LAYOUT)

        kwargs["layout"] = WIDGET_LAYOUT
        new_widget = widget(**kwargs)
        new_widget.widget_spec = dataclass_to_camel_dict(new_widget.spec)

        jsdlink((self._toolbar_widget, "table"),
                (new_widget, "table"))
        jslink((self._toolbar_widget, 'symphony_spec'),
               (new_widget, 'symphony_spec'))
        jslink((self._toolbar_widget, 'selected'),
               (new_widget, 'selected'))
        jslink((self._toolbar_widget, 'filter'),
               (new_widget, 'filter'))
        jslink((self._toolbar_widget, 'group_columns'),
               (new_widget, 'group_columns'))

        self._widgets[widget.name] = new_widget

        items = [new_widget, self._toolbar_widget]
        return HBox(items, layout=WIDGET_LAYOUT)

    def export(self,
               export_path: Union[str, Path],
               name: str = None,
               files_path: Union[str, Path] = None,
               symlink_files: bool = False):
        """
        Export the current widgets to a static page.
        Creates a directory with an :code:`index.html` file, data folder, and JavaScript files for each widget.

        Parameters
        ----------
        export_path: str or Path
            The folder to export the static page to.
        name : str, optional
            Name of the exported app.
            By default :code:`None`, using the export path.
        files_path : str or Path, optional
            The location to fetch files from if different from the original path.
            By default :code:`None`, using the original path.
        symlink_files : bool, optional
            Whether to create a symlink to local data, by default :code:`False`.
        """
        symphony_spec = self._symphony_spec

        export_data_path = files_path
        if export_data_path is None:
            export_data_path = self._files_path

        export_path = Path(export_path)
        if name is None:
            name = export_path.name

        symphony_spec.files_path = 'files/' if symlink_files else str(
            export_data_path)
        export_path.mkdir(parents=True, exist_ok=True)

        # Copy the base HTML file for the standalone app.
        app_files_path = Path((Path(__file__).parent), 'standalone')
        try:
            shutil.copy(Path(app_files_path, 'index.html'), Path(export_path))
        except shutil.SameFileError:
            pass
        try:
            shutil.copy(Path(app_files_path, 'favicon.png'), Path(export_path))
        except shutil.SameFileError:
            pass

        # Symlink the data files.
        if symlink_files:
            symlink_dest = Path(export_path, 'files')
            if symlink_dest.exists():
                symlink_dest.unlink()
            Path(symlink_dest).symlink_to(
                Path(self._files_path).absolute(), target_is_directory=True)

        # Export the compiled widgets.
        widgets_path = Path(export_path, 'widgets')
        widgets_path.mkdir(parents=True, exist_ok=True)
        try:
            shutil.copy(Path(app_files_path, 'widgets',
                        'StandaloneApp.js'), Path(export_path, 'widgets'))
        except shutil.SameFileError:
            pass
        try:
            shutil.copy(Path(app_files_path, 'widgets',
                        'StandaloneApp.js.map'), Path(export_path, 'widgets'))
        except (shutil.SameFileError, FileNotFoundError) as _:
            pass

        # Generate the JS file importing each widget.
        import_statements = [
            'import {StandaloneApp} from "./widgets/StandaloneApp.js";']
        import_template = Template('import {$name} from "./widgets/$name.js";')
        components = []
        component_template = Template('$name: $name,')

        data_path = Path(export_path, 'data')
        data_path.mkdir(parents=True, exist_ok=True)
        widget_info = {
            "experiment": name,
            "spec": dataclass_to_camel_dict(symphony_spec),
            "pages": {},
            "exportID": str(uuid.uuid1())
        }
        pages = {}
        for widget_id in self._widgets:
            widget = self._widgets[widget_id]
            import_statements.append(import_template.substitute(
                name=widget.widget_spec['name']))
            components.append(component_template.substitute(
                name=widget.widget_spec['name']))
            current_widgets = pages.get(widget.widget_spec['page'], [])
            current_widgets.append(widget.export(export_path))
            pages[widget.widget_spec['page']] = current_widgets
        widget_info['pages'] = pages

        with open(Path(data_path, 'widget_info.json'), 'w') as info_file:
            json.dump(widget_info, info_file)
        if self._table_link == None:
            table_to_file(deserialize_table(self._toolbar_widget.table),
                          Path(data_path, 'table.arrow'))
        else:
            with open(Path(data_path, 'table.txt'), 'w') as table_file:
                table_file.write(self._table_link)

        script_text = ''.join(import_statements) \
            + 'const components = {' + ''.join(components) + '};' \
            + 'const app = new StandaloneApp({target: document.body,props: {components: components,},});export default app;'
        with open(Path(export_path, 'script.js'), 'w') as script_file:
            script_file.write(script_text)

    def standalone(self,
                   widgets: List[Type[SymphonyWidget]],
                   export_path: Union[str, Path],
                   widget_params: List[Dict] = [],
                   name: str = None,
                   files_path: Union[str, Path] = None,
                   symlink_files: bool = False):
        """
        Create a standalone app with the given widgets.
        Similar to the :code:`export()` function but does not require the widgets to have been passed to Symphony beforehand.

        Parameters
        ----------
        widgets: List[Type[SymphonyWidget]]
            List of SymphonyWidgets to include in the standalone app.
        export_path: str or Path
            Where to export the standalone app to.
        widget_params: List[Dict]
            List of named parameters to pass to each widget. 
            Must be the same length as widgets, and be an empty dict :code:`{}` for no options.
            By default an empty list.
        name: str, optional
            Name of this exported app.
            By default :code:`None`, using the export path.
        files_path: str or Path, optional
            The location to fetch files from if different from the original path.
            By default :code:`None`, using the original path.
        symlink_files: bool, optional
            Whether to create a symlink to local data, by default :code:`False`.
        """
        for i, standalone_widget in enumerate(widgets):
            self.widget(standalone_widget, **widget_params[i]) if len(
                widget_params) == len(widgets) else self.widget(standalone_widget)

        self.export(export_path, name=name, files_path=files_path,
                    symlink_files=symlink_files)

    def get_symphony_spec(self) -> SymphonySpec:
        """Get the Symphony spec for the current Symphony report

        Returns
        -------
        SymphonySpec
            The spec for the current Symphony report.
        """
        return SymphonySpec(**camel_dict_to_snake_case_dict(
            self._toolbar_widget.symphony_spec))

    def get_layout(self) -> List[dict]:
        """Get the current static app layout.

        Returns
        -------
        List
            Set of pages with their corresponding layout settings.
        """
        pages = {}
        for identifier in self._widgets:
            widget = self._widgets[identifier]
            current_widgets = pages.get(widget.widget_spec['page'], [])
            current_widgets.append(
                {
                    "name": widget.widget_spec['name'],
                    "height": widget.widget_spec['height'],
                    "width": widget.widget_spec['width'],
                }
            )
            pages[widget.widget_spec['page']] = current_widgets
        return pages

    def get_selected(self) -> List[str]:
        """Get the selected instances for Symphony.

        Returns
        ----------
        List
            List of selected instances to update Symphony with.
        """
        return self._toolbar_widget.selected

    def get_filter(self) -> str:
        """Get the filter string for Symphony.

        Returns
        ----------
        str
            The filter that will be applied to the table.
        """
        return self._toolbar_widget.filter

    def get_group_columns(self) -> List[str]:
        """Get the columns of the table by which to apply grouping.

        Parameters
        ----------
        List[str]
            The columns by which to apply grouping.
        """
        return self._toolbar_widget.group_columns

    def get_table(self) -> pa.Table:
        """Get the table based on which Symphony creates visualizations.

        Returns
        ----------
        pa.Table
            The table on which visualizations should be based.
        """
        return deserialize_table(self._toolbar_widget.table)

    def set_symphony_spec(self, spec: Union[SymphonySpec, dict]) -> Union[SymphonySpec, dict]:
        """Set the Symphony spec for the current Symphony report.

        Parameters
        ----------
        spec: SymphonySpec or dict
            The new spec to set for the Symphony report.
        """
        if isinstance(spec, dict):
            spec = SymphonySpec(**spec)
        self._toolbar_widget.symphony_spec = dataclass_to_camel_dict(spec)

    def set_layout(self, layout: List):
        """Set the current static app layout.

        Parameters
        ----------
        layout : List
            List of pages describing each widget's layout settings.
        """
        new_widgets = {}
        for (key, value) in layout.items():
            for spec in value:
                identifier = next(
                    (x for x in self._widgets if x ==
                     spec["name"]), None
                )
                if identifier is not None:
                    widget = self._widgets[identifier]
                    widget.widget_spec['width'] = spec["width"]
                    widget.widget_spec['height'] = spec["height"]
                    widget.widget_spec['page'] = key
                    new_widgets[identifier] = widget
        self._widgets = {**self._widgets,  **new_widgets}

    def set_selected(self, selected: List[str]):
        """Set the selected instances for Symphony.

        Parameters
        ----------
        selected : List
            List of selected instances to update Symphony with.
        """
        self._toolbar_widget.selected = selected

    def set_filter(self, filter: str):
        """Set the filter string for Symphony.

        Parameters
        ----------
        filter : str
            The filter that will be applied to the table.
        """
        self._toolbar_widget.filter = filter

    def set_group_columns(self, group_columns: List[str]):
        """Set the columns of the table by which to apply grouping.

        Parameters
        ----------
        group_columns : List[str]
            The columns by which to apply grouping.
        """
        self._toolbar_widget.group_columns = group_columns

    def set_table(self, table: Union[pa.Table, pd.DataFrame]):
        """Set the table based on which Symphony creates visualizations.

        Parameters
        ----------
        table : Union[pa.Table, pd.DataFrame]
            The table on which visualizations should be based.
        """
        if isinstance(table, pd.DataFrame):
            table = pa.Table.from_pandas(table)
        self._toolbar_widget.table = serialize_table(table)
