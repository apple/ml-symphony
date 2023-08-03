.. For licensing see accompanying LICENSE file.
.. Copyright (C) 2023 Apple Inc. All Rights Reserved.

********
Examples
********

========================
Exploring Image Datasets
========================

`Run the example Jupyter notebook here. <https:/github.com/apple/ml-symphony/examples/symphony-cifar-example.ipynb>`_

Symphony has a set of widgets that use preprocessing to analyze large ML datasets.
In this example, we look at the `CIFAR-10 <https://www.cs.toronto.edu/~kriz/cifar.html>`_ image classification dataset and use `DNIKit <https://github.com/apple/dnikit>`_ to generate an interactive dataset report.

The example contains a precomptued analysis and demonstrates a handful of Symphony widgets:

* `Summary <https://github.com/apple/ml-symphony/tree/main/widgets/symphony_summary>`__: A summary of the datset with distribution charts for each column in the dataset.
* `List <https://github.com/apple/ml-symphony/tree/main/widgets/symphony_list>`__ : An browsable interface to explore the datset instances.
* `Scatterplot <https://github.com/apple/ml-symphony/tree/main/widgets/symphony_scatterplot>`__: An interactive embedding visualization to help with cluster identification.
* `Familiarity <https://github.com/apple/ml-symphony/tree/main/widgets/symphony_familiarity>`__: The familiarity widget calculates how common each image is relative to the whole dataset. It can be used to find outliers and uncommon classes.
* `Duplicates <https://github.com/apple/ml-symphony/tree/main/widgets/symphony_duplicates>`__: The duplicates widget calculates which images are the most visually similar or may be the same instance.

It can be used to find train/test overlap or other data redundancy issues.

===============
Widget Examples
===============

Each widget contains an example. Check out each in the :doc:`components`.
