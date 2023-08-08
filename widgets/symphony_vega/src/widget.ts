// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyVega from './SymphonyVega.svelte';

export class SymphonyVegaModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyVegaModel.model_name,
      _model_module: SymphonyVegaModel.model_module,
      _model_module_version: SymphonyVegaModel.model_module_version,
      _view_name: SymphonyVegaModel.view_name,
      _view_module: SymphonyVegaModel.view_module,
      _view_module_version: SymphonyVegaModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyVegaModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyVegaView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyVegaView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyVega,
      },
    });
  }
}
