yarn
yarn workspace @apple/symphony-lib build
yarn workspace @apple/symphony-ui build
pip3 install -e "symphony_ui[docs]"
jupyter nbextension install --sys-prefix --symlink --overwrite --py symphony_ui
jupyter nbextension enable symphony_ui --py --sys-prefix
