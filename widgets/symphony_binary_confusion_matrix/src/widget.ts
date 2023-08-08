// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import {serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyBinaryConfusionMatrix from './SymphonyBinaryConfusionMatrix.svelte';

export class SymphonyBinaryConfusionMatrixModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyBinaryConfusionMatrixModel.model_name,
      _model_module: SymphonyBinaryConfusionMatrixModel.model_module,
      _model_module_version: SymphonyBinaryConfusionMatrixModel.model_module_version,
      _view_name: SymphonyBinaryConfusionMatrixModel.view_name,
      _view_module: SymphonyBinaryConfusionMatrixModel.view_module,
      _view_module_version: SymphonyBinaryConfusionMatrixModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyBinaryConfusionMatrixModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyBinaryConfusionMatrixView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyBinaryConfusionMatrixView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyBinaryConfusionMatrix,
      },
    });
  }
}
