import * as vscode from 'vscode'
import { bookmarksManager } from './bookmarks'
import * as pkg from "./version.json"

export function activate(context: vscode.ExtensionContext): void {
  bookmarksManager.init(context)

  context.subscriptions.push(
    vscode.commands.registerCommand('tlen-ext.tlenVersion', function () {
      console.log('pkg version--->', pkg.version);
      vscode.window.showInformationMessage('Tlen version: ' + pkg.version + ' typescript');
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('tlen-ext.tlenI18nkey', async function () {
      console.log('tlen conver clipboard to i18n key--->');
      let clipboard_content = await vscode.env.clipboard.readText();
      if ((typeof clipboard_content) === 'string') {
        let newtext = clipboard_content.toLowerCase().replaceAll(/\s(.)/gm, (x: string) => x.toUpperCase()).replaceAll(' ', '').replaceAll(/[!"`'#%&.,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/g, '')
        vscode.env.clipboard.writeText(newtext)
      }
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('tlen-ext.i18nally', async function () {
      console.log('tlen i18nally--->');
      let msext: any = vscode.extensions.getExtension("hancel.google-translate");
      if (!msext?.isActive) {
        vscode.window.showInformationMessage('Tlen i18n-ally ang Google Translate not Active');
      } else {
        let text: string = await vscode.commands.executeCommand("i18n-ally.extract-text")
        if (text) {
          console.log('text--->', text);
          vscode.window.showInformationMessage(text);
        } else {
          await vscode.commands.executeCommand("translates.clipboard")
          let clipboard_content = await vscode.env.clipboard.readText();
          if ((typeof clipboard_content) === 'string') {
            let newtext = clipboard_content.toLowerCase().replaceAll(/\s(.)/gm, (x: string) => x.toUpperCase()).replaceAll(/[ !"`'#%&.,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/g, '')
            vscode.env.clipboard.writeText('txt.' + newtext)
          }
        }
      }
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
    vscode.commands.registerCommand('tlen-ext.navigateToPrevBookmark', () => {
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

export function deactivate() { }
