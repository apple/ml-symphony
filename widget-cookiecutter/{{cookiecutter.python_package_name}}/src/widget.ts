// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

// Widget created by {{cookiecutter.author_name}}, {{cookiecutter.year}}.

import { MODULE_NAME, MODULE_VERSION } from './version';
import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import {serializers, JupyterWidget } from '@apple/symphony-lib';

import {{cookiecutter.widget_identifier}} from './{{cookiecutter.widget_identifier}}.svelte';

export class {{cookiecutter.widget_identifier}}Model extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: {{cookiecutter.widget_identifier}}Model.model_name,
      _model_module: {{cookiecutter.widget_identifier}}Model.model_module,
      _model_module_version: {{cookiecutter.widget_identifier}}Model.model_module_version,
      _view_name: {{cookiecutter.widget_identifier}}Model.view_name,
      _view_module: {{cookiecutter.widget_identifier}}Model.view_module,
      _view_module_version: {{cookiecutter.widget_identifier}}Model.view_module_version,
    };
  }
  static serializers: ISerializers = serializers;

  static model_name = '{{cookiecutter.widget_identifier}}Model';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = '{{cookiecutter.widget_identifier}}View'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class {{cookiecutter.widget_identifier}}View extends DOMWidgetView {
  render() {
    new JupyterWidget({
      target: this.el,
      props: {
        model: this.model,
        widget: {{cookiecutter.widget_identifier}},
      },
    });
  }
}
