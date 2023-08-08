# BEFORE DEPLOY: Update the python package versions in Symphony and each widget's _version.py file.

yarn
yarn workspace @apple/symphony-lib build
(cd symphony_ui; rm -rf dist; yarn build; python setup.py bdist_wheel; python setup.py sdist; twine upload dist/*)

for d in widgets/* ; do
	(cd $d; yarn build; rm -rf dist; python setup.py bdist_wheel; python setup.py sdist; twine upload dist/*)
done
