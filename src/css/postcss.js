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

    this.plugins = [
      'autoprefixer'
    ]

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
    console.dir({ async: true, sourceCode, filePath })
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
  }

  shouldCompileFileSync (fileName, compilerContext) {
    return false
  }

  determineDependentFilesSync (sourceCode, filePath, compilerContext) {
    return []
  }

  compileSync (sourceCode, filePath, compilerContext) {
    console.dir({ sync: true, sourceCode, filePath })

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

    let result = postcss.process(sourceCode, opts)

    console.log(result.css)

    return {
      code: result.css,
      mimeType: 'text/css'
    }
  }

  getCompilerVersion () {
    return require('postcss/package.json').version
  }
}
