// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

import { JupyterWidget } from '@apple/symphony-lib';

import Toolbar from './toolbar/Toolbar.svelte';

export class ToolbarModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ToolbarModel.model_name,
      _model_module: ToolbarModel.model_module,
      _model_module_version: ToolbarModel.model_module_version,
      _view_name: ToolbarModel.view_name,
      _view_module: ToolbarModel.view_module,
      _view_module_version: ToolbarModel.view_module_version,
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'ToolbarModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ToolbarView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class ToolbarView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: Toolbar,
      },
    });
  }
}
