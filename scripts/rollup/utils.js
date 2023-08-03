import fs from 'fs'
import path from 'path'

import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'

//获取packages的目录
const pkgPath = path.resolve(__dirname, '../../packages');
//获取打包后的目录
const distPath = path.resolve(__dirname,'../../dist/node_modules')

//获取packages下包的目录
function resolvePkgPath(name,isDist) {
   if(isDist){
    return `${distPath}/${name}`;
   }
   return `${pkgPath}/${name}`;
}

//获取包中package.json的内容
function getPackageJson(name) {
  const packageJSON = fs.readFileSync(`${pkgPath}/${name}/package.json`,{encoding: 'utf-8'});
  return JSON.parse(packageJSON)
}

//公共插件
function getBaseRollupPlugins({typescript = {}} = {}) {
  return [cjs(), ts(typescript)]
}

export {
  getPackageJson,
  resolvePkgPath,
  getBaseRollupPlugins
}