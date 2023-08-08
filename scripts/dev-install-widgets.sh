for d in widgets/* ; do
	pip3 install -e $d
	NAME=`basename $d`
	jupyter nbextension install --sys-prefix --symlink --overwrite --py $NAME
	jupyter nbextension enable $NAME --py --sys-prefix
done
