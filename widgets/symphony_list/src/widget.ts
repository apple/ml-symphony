// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import {serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyList from './SymphonyList.svelte';

export class SymphonyListModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyListModel.model_name,
      _model_module: SymphonyListModel.model_module,
      _model_module_version: SymphonyListModel.model_module_version,
      _view_name: SymphonyListModel.view_name,
      _view_module: SymphonyListModel.view_module,
      _view_module_version: SymphonyListModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyListModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyListView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyListView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyList,
      },
    });
  }
}
