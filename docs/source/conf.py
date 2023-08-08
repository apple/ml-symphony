# For licensing see accompanying LICENSE file.
# Copyright (C) 2023 Apple Inc. All Rights Reserved.

# Configuration file for the Symphony documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import os
import sys
import symphony_ui
sys.path.insert(0, os.path.abspath('../../symphony/'))


# -- Project information -----------------------------------------------------

project = 'symphony'
copyright = '2023, Apple'
author = 'Apple'

# The short X.Y version
version = symphony_ui.__version__
# The full version, including alpha/beta/rc tags
release = version

# -- General configuration ---------------------------------------------------

# Add any Symphony extension module names here, as strings. They can be
# extensions coming with Symphony (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.doctest',
    'sphinx.ext.todo',
    'sphinx.ext.coverage',
    'sphinx.ext.viewcode',
    'sphinx.ext.autosectionlabel',
    'sphinx.ext.napoleon',
    'sphinx.ext.intersphinx',
    'nbsphinx',
    'jupyter_sphinx',
    'sphinx_mdinclude'
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []

# The language for content autogenerated by Sphinx. Refer to documentation
# for a list of supported languages.
#
# This is also used if you do content translation via gettext catalogs.
# Usually you set "language" from the command line for these cases.
language = "en"

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_book_theme'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

html_title = "Symphony"


def setup(app):
    app.add_css_file("theme_overrides.css")


# If true, `todo` and `todoList` produce output, else they produce nothing.
todo_include_todos = True

# -- autodoc extension configuration --
autodoc_typehints = "description"
autodoc_member_order = 'bysource'
autoclass_content = "both"
add_module_names = False

# -- intersphinx extension configuration --
intersphinx_mapping = {
    'python': ('https://docs.python.org/3/', None),
    'numpy': ('http://docs.scipy.org/doc/numpy/', None),
}

# -- nbsphinx configuration --
nbsphinx_allow_errors = True
nbsphinx_execute = 'always'
nbsphinx_timeout = 300

html_theme_options = {
    "home_page_in_toc": True
}

source_suffix = ['.rst', '.md']
