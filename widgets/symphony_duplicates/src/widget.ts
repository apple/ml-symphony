// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import {serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyDuplicates from './SymphonyDuplicates.svelte';

export class SymphonyDuplicatesModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyDuplicatesModel.model_name,
      _model_module: SymphonyDuplicatesModel.model_module,
      _model_module_version: SymphonyDuplicatesModel.model_module_version,
      _view_name: SymphonyDuplicatesModel.view_name,
      _view_module: SymphonyDuplicatesModel.view_module,
      _view_module_version: SymphonyDuplicatesModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyDuplicatesModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyDuplicatesView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyDuplicatesView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyDuplicates,
      },
    });
  }
}
