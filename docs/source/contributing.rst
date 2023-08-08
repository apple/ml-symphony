.. For licensing see accompanying LICENSE file.
.. Copyright (C) 2023 Apple Inc. All Rights Reserved.

************
Contributing
************

To add more functionality to :code:`symphony_ui`, :code:`symphony_lib`, or any component, first set up a dev environment.
Then, packages can be updated and deployed.
If your change could be useful to other users, please consider making a `pull request <https://github.com/apple/ml-symphony/pulls>`_.

========================
Development Installation
========================

**1. Install JavaScript package managers.**

Install `Node`_ and `Yarn`_ globally on your machine.

**2. Create a Python environment.**

With :code:`conda`, using :code:`symphony` as the environment name:

.. code-block:: bash 

    conda create -n symphony python=3.11
    conda activate symphony

Or, instead using :code:`venv`:

.. code-block:: bash 

    virtualenv --python /usr/local/opt/python/bin/python3 venv
    source venv/bin/activate

**3. Install Python dependencies.**

Install Python dependences by running:

.. code-block:: bash 

    pip install -r requirements.txt

**4. Install Symphony packages.**

First, install the :code:`symphony_ui` Python package.

.. code-block:: bash 

    scripts/dev-install.sh

Optionally, install all the widgets:

.. code-block:: bash 

    scripts/dev-install-widgets.sh

**5. Build and watch for changes.**

For the main :code:`symphony_ui` package:

.. code-block:: bash 

    yarn dev

For :code:`symphony_lib`:

.. code-block:: bash

    cd symphony_lib
    yarn watch

Optionally, for the widgets:

.. code-block:: bash 

    scripts/dev-watch-widgets.sh

===============
Deployment Note
===============

As all packages depend on :code:`symphony_lib`, whenever :code:`symphony_lib` is updated, all packages need to follow.
To do that, you need to manually bump all :code:`_version.py` files for all widgets and for the main Symphony package.
Then, you can use:

.. code-block:: bash 

    scrips/dev-watch-widgets.sh 

.. _Node: https://nodejs.org/
.. _Yarn: https://yarnpkg.com/