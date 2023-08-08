// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import {serializers, JupyterWidget } from '@apple/symphony-lib';

import SymphonyMarkdown from './SymphonyMarkdown.svelte';

export class SymphonyMarkdownModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SymphonyMarkdownModel.model_name,
      _model_module: SymphonyMarkdownModel.model_module,
      _model_module_version: SymphonyMarkdownModel.model_module_version,
      _view_name: SymphonyMarkdownModel.view_name,
      _view_module: SymphonyMarkdownModel.view_module,
      _view_module_version: SymphonyMarkdownModel.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = 'SymphonyMarkdownModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SymphonyMarkdownView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SymphonyMarkdownView extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: SymphonyMarkdown,
      },
    });
  }
}
