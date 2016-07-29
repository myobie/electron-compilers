import path from 'path'
import { CompilerBase } from '../compiler-base'

let postcss
const mimeTypes = ['text/css']

export default class PostCSSCompiler extends CompilerBase {
  constructor () {
    super()

    this.compilerOptions = {
      map: { inline: true }
    }

    this.plugins = []

    this.seenFilePaths = {}
  }

  static getInputMimeTypes () {
    return mimeTypes
  }

  shouldCompileFile (fileName, compilerContext) {
    console.dir({ compilerContext })
    return true
  }

  determineDependentFiles (sourceCode, filePath, compilerContext) {
    return []
  }

  async compile (sourceCode, filePath, compilerContext) {
    console.dir({ async: true, sourceCode, filePath })

    try {
      if (!postcss) {
        const compiler = require('postcss')
        const plugins = this.plugins.map(name => require(name))
        postcss = compiler.process(plugins)
      }

      let thisPath = path.dirname(filePath)
      this.seenFilePaths[thisPath] = true

      let paths = Object.keys(this.seenFilePaths)

      if (this.compilerOptions.paths) {
        paths.push(...this.compilerOptions.paths)
      }

      let opts = Object.assign({}, this.compilerOptions, {
        paths: paths,
        filename: path.basename(filePath)
      })

      let result = await postcss.process(sourceCode, opts)

      console.log(result.css)

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
    throw new Error('sync compile not supported for postcss')
  }

  getCompilerVersion () {
    return require('postcss/package.json').version
  }
}
