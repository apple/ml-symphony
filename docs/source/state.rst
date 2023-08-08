.. For licensing see accompanying LICENSE file.
.. Copyright (C) 2023 Apple Inc. All Rights Reserved.

**************
Symphony State
**************

All components have access to the same, shared state.

.. csv-table:: 
   :file: ./state.csv
   :widths: 30, 60, 10
   :header-rows: 1
   :delim: |

If your component has additional requirements, the :code:`WidgetSpec` needs to be changed.
For that, :code:`[your_widget_name]/widget.py` needs to be modified to take additional parameters, for example:

.. code-block:: python

    def __init__(self,
                     width: str = 'XXL',
                     height: str = 'M',
                     page: str = 'Binary Confusion Matrix',
                     label_column: str = '',
                     prediction_column: str = '',
                     **kwargs
                     ):
            """A simple binary confusion matrix extension that takes into account grouping.
    
            Parameters
            ----------
            width : str, optional
                By default "XXL".
            height : str, optional
                By default "M".
            page : str, optional
                Which page of the dashboard to show the widget on, by default "SymphonyBinaryConfusionMatrix".
            label_column: str, optional
                The column with the instance label. By default empty.
            prediction_column: str, optional
                The column with the model's prediction. By default empty.
    
            Returns
            -------
            SymphonyBinaryConfusionMatrix
            """
            super().__init__(**kwargs)
            self.width: str = width
            self.height: str = height
            self.page: str = page
            self.spec = symphony_ui.ClassificationSpec(
                width=width,
                height=height,
                page=page,
                label_column=label_column,
                prediction_column=prediction_column,
                name=self.name,
                description=self.description
            )

This component takes 2 additional parameters, namely :code:`label_column` and :code:`prediction_column`.
To support typing for this new spec, both the main Symphony :code:`_specs.py` and Symphony Lib's :code:`types.ts` need to be augmented.
