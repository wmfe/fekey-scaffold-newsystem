#!/bin/bash
export PATH=/home/fis/npm/bin:$PATH
#project目录
PROJECT_ROOT=$PWD
#模块名称
modulename=`basename $PWD`
#输出目录
outputdir=$PROJECT_ROOT/output
#模块目录
moduledir=$PROJECT_ROOT/output/$modulename
#插件目录
plugindir=$moduledir/php/phplib/ext/smarty
#data目录 map.json
mapdir=$moduledir/data/smarty

echo "[Module Name] "$modulename
#fis发布到output目录
fis3 --version --no-color

echo $moduledir

fis3 release -ud $moduledir --no-color
cd $moduledir
#创建插件目录
mkdir -p $plugindir
mv ./plugin $plugindir
mkdir -p $mapdir
mv ./config $mapdir

#删除多余文件
rm -rf test server-conf config stat.php index.php
#打包
tar -czvf $outputdir/$modulename.tar.gz ./
cd $outputdir
rm -rf $modulename
