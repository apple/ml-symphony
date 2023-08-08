// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

// Entry point for the notebook bundle containing custom model definitions.
//
define(function() {
    "use strict";

    window['requirejs'].config({
        map: {
            '*': {
                'symphony_ui': 'nbextensions/symphony_ui/index',
            },
        }
    });
    // Export the required load_ipython_extension function
    return {
        load_ipython_extension : function() {}
    };
});