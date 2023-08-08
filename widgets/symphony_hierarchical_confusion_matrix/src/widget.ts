// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import {serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyHierarchicalConfusionMatrix from './SymphonyHierarchicalConfusionMatrix.svelte';

export class SymphonyHierarchicalConfusionMatrixModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyHierarchicalConfusionMatrixModel.model_name,
      _model_module: SymphonyHierarchicalConfusionMatrixModel.model_module,
      _model_module_version: SymphonyHierarchicalConfusionMatrixModel.model_module_version,
      _view_name: SymphonyHierarchicalConfusionMatrixModel.view_name,
      _view_module: SymphonyHierarchicalConfusionMatrixModel.view_module,
      _view_module_version: SymphonyHierarchicalConfusionMatrixModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyHierarchicalConfusionMatrixModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyHierarchicalConfusionMatrixView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyHierarchicalConfusionMatrixView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyHierarchicalConfusionMatrix,
      },
    });
  }
}
