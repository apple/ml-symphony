// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import {serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyFamiliarity from './SymphonyFamiliarity.svelte';

export class SymphonyFamiliarityModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyFamiliarityModel.model_name,
      _model_module: SymphonyFamiliarityModel.model_module,
      _model_module_version: SymphonyFamiliarityModel.model_module_version,
      _view_name: SymphonyFamiliarityModel.view_name,
      _view_module: SymphonyFamiliarityModel.view_module,
      _view_module_version: SymphonyFamiliarityModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyFamiliarityModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyFamiliarityView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyFamiliarityView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyFamiliarity,
      },
    });
  }
}
