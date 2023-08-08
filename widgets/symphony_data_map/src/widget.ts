// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyDataMap from './SymphonyDataMap.svelte';

export class SymphonyDataMapModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyDataMapModel.model_name,
      _model_module: SymphonyDataMapModel.model_module,
      _model_module_version: SymphonyDataMapModel.model_module_version,
      _view_name: SymphonyDataMapModel.view_name,
      _view_module: SymphonyDataMapModel.view_module,
      _view_module_version: SymphonyDataMapModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyDataMapModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyDataMapView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyDataMapView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyDataMap,
      },
    });
  }
}
