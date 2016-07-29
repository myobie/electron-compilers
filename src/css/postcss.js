import path from 'path'
import { CompilerBase } from '../compiler-base'

let postcss

const mimeTypes = ['text/css']

export default class PostCSSCompiler extends CompilerBase {
  constructor () {
    super()
    this.seenFilePaths = {}
  }

  static getInputMimeTypes () {
    return mimeTypes
  }

  shouldCompileFile (fileName, compilerContext) {
    return true
  }

  determineDependentFiles (sourceCode, filePath, compilerContext) {
    return []
  }

  async compile (sourceCode, filePath, compilerContext) {
    try {
      if (!postcss) {
        postcss = require('postcss')()
        if (this.compilerOptions.plugins) {
          for (let pluginName of this.compilerOptions.plugins) {
            const plugin = require(pluginName)
            postcss = postcss.use(plugin)
          }
        }
      }

      let thisPath = path.dirname(filePath)
      this.seenFilePaths[thisPath] = true

      let paths = Object.keys(this.seenFilePaths)

      if (this.compilerOptions.paths) {
        paths.push(...this.compilerOptions.paths)
      }

      let opts = Object.assign({}, this.compilerOptions, {
        filename: path.basename(filePath),
        from: filePath,
        root: process.cwd()
      })

      let result = await postcss.process(sourceCode, opts)

      return {
        code: result.css,
        mimeType: 'text/css'
      }
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  shouldCompileFileSync (fileName, compilerContext) {
    return false
  }

  determineDependentFilesSync (sourceCode, filePath, compilerContext) {
    return []
  }

  compileSync (sourceCode, filePath, compilerContext) {
    console.error('sync compile not supported for postcss')
    throw new Error('sync compile not supported for postcss')
  }

  getCompilerVersion () {
    return require('postcss/package.json').version
  }
}
