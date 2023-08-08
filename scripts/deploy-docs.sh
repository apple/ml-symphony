rm -rf docs/build/*
yarn run build:docs
cp docs/.nojekyll docs/build/html
gh-pages -d docs/build/html -t true -m "Deploy $(git log '--format=format:%H' main -1)"