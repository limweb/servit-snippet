import * as fs from 'fs'
import * as vscode from 'vscode'
import { logger } from './logger'

const LINE_END = 999

export const isDebug = () => false

export const fileExists = (path: string) => fs.existsSync(path)

export const moveCursorToLine = (line: number, column: number = LINE_END) => {
  if (!vscode.window.activeTextEditor) {
    return
  }

  let reviewType: vscode.TextEditorRevealType = vscode.workspace
    .getConfiguration('tlen-ext')
    .get('alignTopOnNavigation', false)
    ? vscode.TextEditorRevealType.AtTop
    : vscode.TextEditorRevealType.InCenterIfOutsideViewport

  const newSelection = new vscode.Selection(line, column, line, column)
  vscode.window.activeTextEditor.selection = newSelection
  vscode.window.activeTextEditor.revealRange(newSelection, reviewType)
}

export const line2range = (line: number) => {
  const start = new vscode.Position(line, 0)
  const end = new vscode.Position(line, LINE_END)
  return new vscode.Range(start, end)
}

export const range2line = (range: vscode.Range): number => range.start.line

export const getNextLine = (lines: number[], currentLine: number): number => {
  if (!lines.length) {
    return currentLine
  }

  logger.info(`getNextLine: ${JSON.stringify(lines)} ${currentLine}`)

  if (currentLine < lines[0]) {
    return lines[0]
  } else if (currentLine >= lines[lines.length - 1]) {
    return lines[0]
  }

  let index = 1
  while (currentLine >= lines[index++]) { }

  return lines[index - 1]
}

export const getPrevLine = (lines: number[], currentLine: number): number => {
  if (!lines.length) {
    return currentLine
  }

  logger.info(`getPrevLine: ${JSON.stringify(lines)} ${currentLine}`)

  if (currentLine > lines[lines.length - 1]) {
    return lines[lines.length - 1]
  } else if (currentLine <= lines[0]) {
    return lines[lines.length - 1]
  }

  let index = lines.length - 2
  while (currentLine <= lines[index--]) { }

  return lines[index + 1]
}

export const createDecoration = (
  context: vscode.ExtensionContext,line: number
): vscode.TextEditorDecorationType => {
  let renderLine = vscode.workspace.getConfiguration('tlen-ext').get('renderLine', true);
  let linex = '$';
  const gutterIconPath = vscode.Uri.parse(
    `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg"> <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"> <g fill="#00ff25" stroke="null"><path d="M5.573914546804859,0.035123038858889274 C4.278736002284275,0.035123038858889274 3.228793828301391,0.9189688905396587 3.228793828301391,2.005394862080541 L3.228793828301391,15.844184705765102 L7.923495246522241,11.89191599548129 L12.618212313799981,15.844184705765102 L12.618212313799981,2.005394862080541 C12.618212313799981,0.9172430665361684 11.56845792849979,0.035123038858889274 10.273075946239627,0.035123038858889274 L5.573898897747966,0.035123038858889274 L5.573914546804859,0.035123038858889274 z" stroke="null"></path></g> </g> <text text-anchor="middle" alignment-baseline="middle" x="7.6" y="7.5" fill="" font-weight="bold" font-size="9" font-family="Menlo, Monaco, monospace">$</text> </svg>`,
    )}`,
  );
  const borderColor: string = vscode.workspace.getConfiguration('tlen-ext').get('borderColor', "#65EAB9");
  const borderWidth = vscode.workspace.getConfiguration('tlen-ext').get("borderWidth", "3px");
  const borderStyle = vscode.workspace.getConfiguration('tlen-ext').get("borderStyle", "solid");  
  let decorationOptions: vscode.DecorationRenderOptions = {
      gutterIconPath,
      isWholeLine: true,
      borderWidth: `0 0 ${borderWidth} 0`,
      // borderWidth: '2px',
      backgroundColor: '#12ff1220',
      borderStyle: borderStyle,
      borderColor: borderColor,
      overviewRulerLane: vscode.OverviewRulerLane.Full,
      overviewRulerColor: '#00ff00'
  }

  // if (renderLine) {
  //   decorationOptions = {
  //     gutterIconPath,
  //     // gutterIconPath: context.asAbsolutePath('images/icon.svg'),
  //     // dark: {
  //     //   gutterIconPath: context.asAbsolutePath('images/icond.svg'),
  //     // },
  //     isWholeLine: true,
  //     borderWidth: `0 0 ${borderWidth} 0`,
  //     borderStyle: borderStyle,
  //     borderColor: borderColor
  //   }
  //  } else {
  //   decorationOptions = {
  //     gutterIconPath,
  //     isWholeLine: true,
  //     borderWidth: `0 0 ${borderWidth} 0`,
  //     borderStyle: borderStyle,
  //     borderColor: borderColor      
  //     // gutterIconPath: context.asAbsolutePath('images/icon.svg'),
  //     // dark: {
  //     //   gutterIconPath: context.asAbsolutePath('images/icond.svg'),
  //     // },
  //   }

  // }
  
    return vscode.window.createTextEditorDecorationType(decorationOptions);
}

export const createLinesRange = (start: number, endInclusive: number) => {
  const range = []
  for (let i = start; i <= endInclusive; i++) {
    range.push(i)
  }
  return range
}





