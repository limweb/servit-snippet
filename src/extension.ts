import * as vscode from 'vscode'
import { bookmarksManager } from './bookmarks'
import * as pkg  from "./version.json"

export function activate(context: vscode.ExtensionContext): void {
  bookmarksManager.init(context)

  context.subscriptions.push(
    vscode.commands.registerCommand('tlen-ext.tlenVersion', function() {
      console.log('pkg version--->',pkg.version);
      vscode.window.showInformationMessage('Tlen version: '+ pkg.version +' typescript' );
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('tlen-ext.toogleBookmarks', () => {
      console.log('toogleBookmarks--->');
      bookmarksManager.toggleBookmarks(context)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('tlen-ext.clearAllBookmarks', () => {
      console.log('clearAllBookmarks--->');
      bookmarksManager.clearAllBookmarks(context)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('tlen-ext.navigateToNextBookmark', () => {
        console.log('navigateToNext--->');
        bookmarksManager.navigateToNext()
      }
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('tlen-ext.navigateToPrevBookmark',() => {
        console.log('navigateToPrev--->');
        bookmarksManager.navigateToPrev()
      }
    )
  )

  // Load bookmarks after active file changes.
  vscode.window.onDidChangeActiveTextEditor((editor) => {
      console.log('onDidChangeActiveTextEditor--->');
      bookmarksManager.loadForFile(editor?.document.uri.fsPath, context)
    },
    null,
    context.subscriptions
  )

  // The only way for now to keep bookmarks positions in sync with what is shown in VS Code.
  // @see https://github.com/microsoft/vscode/issues/54147
  vscode.workspace.onDidChangeTextDocument((event) => {
    console.log('onDidChangeTextDocument--->');
    bookmarksManager.handleTextChanges(context, event.contentChanges)
  })
}

export function deactivate() {}
