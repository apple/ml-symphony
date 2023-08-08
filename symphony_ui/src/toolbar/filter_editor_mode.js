// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import * as ace from 'brace';

ace.define(
  'ace/mode/filter_highlight_rules',
  [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text_highlight_rules',
  ],
  (acequire, exports, module) => {
    'use strict';

    var oop = acequire('../lib/oop');
    var TextHighlightRules = acequire(
      './text_highlight_rules'
    ).TextHighlightRules;

    var FilterHighlightRules = function () {
      this.$rules = {
        start: [
          {
            token: 'keyword',
            regex: 'd\\.([a-zA-Z]*)',
          },
          {
            token: 'string',
            regex: '"[\\w\\d\\s]*"',
          },
          {
            token: 'string',
            regex: "'[\\w\\d\\s]*'",
          },
          {
            token: 'constant.numeric',
            regex: '[\\d]+',
          },
        ],
      };

      this.normalizeRules();
    };

    FilterHighlightRules.metaData = {
      fileTypes: ['filter'],
      name: 'Filter',
    };

    oop.inherits(FilterHighlightRules, TextHighlightRules);

    exports.FilterHighlightRules = FilterHighlightRules;
  }
);

ace.define(
  'ace/mode/filter',
  [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/filter_highlight_rules',
  ],
  (acequire, exports, module) => {
    'use strict';

    var oop = acequire('../lib/oop');
    var TextMode = acequire('./text').Mode;
    var FilterHighlightRules = acequire(
      './filter_highlight_rules'
    ).FilterHighlightRules;

    var Mode = function () {
      this.HighlightRules = FilterHighlightRules;
      this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function () {
      this.lineCommentStart = '#';
      this.$id = 'ace/mode/filter';
    }.call(Mode.prototype));

    exports.Mode = Mode;
  }
);
