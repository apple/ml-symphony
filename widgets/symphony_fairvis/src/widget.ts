// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import {serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyFairVis from './SymphonyFairVis.svelte';

export class SymphonyFairVisModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyFairVisModel.model_name,
      _model_module: SymphonyFairVisModel.model_module,
      _model_module_version: SymphonyFairVisModel.model_module_version,
      _view_name: SymphonyFairVisModel.view_name,
      _view_module: SymphonyFairVisModel.view_module,
      _view_module_version: SymphonyFairVisModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyFairVisModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyFairVisView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyFairVisView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyFairVis,
      },
    });
  }
}
