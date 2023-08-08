import {getPackageJson, resolvePkgPath, getBaseRollupPlugins} from './utils'
import generatePackageJson from 'rollup-plugin-generate-package-json'

const {name, module} = getPackageJson('react-dom');

//获取react包的目录
const pkgPath = resolvePkgPath(name)
//获取打包后react包的目录
const pkgDistPath = resolvePkgPath(name, true)

export default [
  {
    //react包的打包
    input:`${pkgPath}/${module}`,
    output:[
      {
        file: `${pkgDistPath}/index.js`,
        name: 'index.js',
        format: 'umd'
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: 'client.js',
        format: 'umd'
      }
    ],
    plugins: [...getBaseRollupPlugins(),
      //打包时带上react的package.json
      generatePackageJson({
      inputFolder: pkgPath,
      outputFolder: pkgDistPath,
      baseContents: ({name, description, version}) => {
        return {
          name,
          description,
          version,
          main: 'index.js'
        }
      }
    })]
  },
]