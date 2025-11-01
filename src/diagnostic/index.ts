import {
  DiagnosticCollection,
  languages,
  Uri,
  workspace,
} from 'vscode'
import diagnosticsFromJunkAnnotations from './diagnostics-from-junk-annotations'

const diagnosticCollections: {
  [path in string]: DiagnosticCollection
} = {}

const updateDiagnosticCollection = async (uri: string) => {
  if (diagnosticCollections[uri] === undefined) {
    diagnosticCollections[uri] = languages.createDiagnosticCollection(uri)
  }
  diagnosticCollections[uri].clear()

  const emitErrors = workspace.getConfiguration('vscode-fluent').get<boolean>('diagnostics.errors.emit', true)
  if (!emitErrors) {
    return
  }

  const textDocument = await workspace.openTextDocument(uri)
  const diagnostics = [
    ...diagnosticsFromJunkAnnotations(uri, textDocument),
  ]

  diagnosticCollections[uri].set(Uri.file(uri), diagnostics)
}

export { updateDiagnosticCollection }
