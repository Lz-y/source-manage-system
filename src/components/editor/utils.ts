import { nextTick } from 'vue'

function getCursorPosition(el: HTMLTextAreaElement) {
    let { selectionStart, selectionEnd } = el
    return [selectionStart, selectionEnd]
}

function setSelectionRange (el: HTMLTextAreaElement,  selectionstart: number, selectionEnd: number, isFocus: boolean = true) {
  nextTick(() => {
    if (isFocus) {
      let {scrollTop} = el
      el.focus()
      el.scrollTop = scrollTop
    }
    el.setSelectionRange(selectionstart, selectionEnd)
  })
}

// **xx**, *xx*, ~~xx~~
export function insertChar (el: HTMLTextAreaElement, symbol: string, txt: string) {
  const [start, end] = getCursorPosition(el)
  const _val = el.value
  const newVal= start === end ?
  _val.substring(0, start) + `${symbol}${txt}${symbol}`+ _val.substring(end) : 
  _val.substring(0, start) + symbol + _val.substring(start, end) + symbol + _val.substring(end)

  const selectionStart = start + symbol.length
  const selectionEnd = end === start ? end + symbol.length + txt.length : end + symbol.length

  setSelectionRange(el, selectionStart, selectionEnd)
  el.value = newVal
}

// 添加列表 - xx, 1. xx
export function insertList (el: HTMLTextAreaElement, symbol: string, txt: string) {
  const [start, end] = getCursorPosition(el)
  const _val = el.value
  const newVal = start === end ?
    _val.substring(0, start) + `\n${symbol} ${txt}\n`+ _val.substring(end) : 
    _val.substring(0, start) + `\n${symbol} ${_val.substring(start, end)}\n` + _val.substring(end)

  const selectionStart = start + 2 + symbol.length// 2个\n, 
  const selectionEnd = end === start ? end + 2 + symbol.length + txt.length : end + 2 + symbol.length

  setSelectionRange(el, selectionStart, selectionEnd)
  el.value = newVal
}

// 添加代码块
export function insertCodeBlank (el: HTMLTextAreaElement, language: string) {
  const [start, end] = getCursorPosition(el)
  const _val = el.value
  const newVal= start === end ?
    _val.substring(0, start) + `\n\`\`\`${language}\n\n\`\`\`\n`+ _val.substring(end) : 
    _val.substring(0, start) + `\n\`\`\`${language}\n${_val.substring(start, end)}\n\`\`\`\n` + _val.substring(end)

  const selectionStart = start + 5 + language.length
  const selectionEnd = end + 5 + language.length

  setSelectionRange(el, selectionStart, selectionEnd)
  el.value = newVal
}

// 添加链接
export function insertLink (el: HTMLTextAreaElement) {
  const [start, end] = getCursorPosition(el)
  const _val = el.value
  const newVal = start === end ?
    _val.substring(0, start) + '[链接描述文字](url)' + _val.substring(end) : 
    _val.substring(0, start) + `[${_val.substring(start, end)}](url)` + _val.substring(end)

  const selectionStart = end === start ? start + 9 : end + 3
  const selectionEnd = end === start ? end + 12  : end + 6

  setSelectionRange(el, selectionStart, selectionEnd)
  el.value = newVal
}

// 添加图片
export function insertImage (el: HTMLTextAreaElement) {
  const [start, end] = getCursorPosition(el)
  const _val = el.value
  const newVal = start === end ?
    _val.substring(0, start) + '\n![图片描述](url)\n' + _val.substring(end) : 
    _val.substring(0, start) + `\n![${_val.substring(start, end)}](url)\n` + _val.substring(end)

  const selectionStart = end === start ? start + 9 : end + 5
  const selectionEnd = end === start ? end + 12  : end + 8

  setSelectionRange(el, selectionStart, selectionEnd)
  el.value = newVal
}

// 添加表格
export function insertTable (el: HTMLTextAreaElement) {
  const [start, end] = getCursorPosition(el)
  const _val = el.value
  const newVal = start === end ?
    _val.substring(0, start) + `\n| | |\n|-|-|\n| | |`+ _val.substring(end) : 
    _val.substring(0, start) + `\n|${_val.substring(start, end)}| |\n|-|-|\n| | |\n` + _val.substring(end)

  const selectionStart = start + 2
  const selectionEnd = end + 2

  setSelectionRange(el, selectionStart, selectionEnd)
  el.value = newVal
}

// 添加标题
export function insertTitle (el: HTMLTextAreaElement, symbol: string, txt: string) {
  const [start, end] = getCursorPosition(el)
  const _val = el.value
  const newVal = start === end ?
    _val.substring(0, start) + `\n${symbol} ${txt}\n` + _val.substring(end) : 
    _val.substring(0, start) + `\n${symbol} ${_val.substring(start, end)}\n` + _val.substring(end)

  const selectionStart = start + 2 + symbol.length
  const selectionEnd = end === start ? end + 2 + symbol.length + txt.length : end + 2 + symbol.length

  setSelectionRange(el, selectionStart, selectionEnd)
  el.value = newVal
}

// 添加引用
export function insertQuote (el: HTMLTextAreaElement) {
  const [start, end] = getCursorPosition(el)
  const _val = el.value
  const newVal = start === end ?
    _val.substring(0, start) + `\n> 引用内容\n`+ _val.substring(end) : 
    _val.substring(0, start) + `\n> ${_val.substring(start, end)}\n` + _val.substring(end)

  const selectionStart = start + 3
  const selectionEnd = end + 3

  setSelectionRange(el, selectionStart, selectionEnd)
  el.value = newVal
}

export const codeLanguage = [
  { key: 'js', language: 'JavaScript' },
  { key: 'ts', language: 'TypeScript' },
  { key: 'html', language: 'HTML' },
  { key: 'css', language: 'CSS' },
  { key: 'java', language: 'Java' },
  { key: 'bash', language: 'Bash' },
  { key: 'c', language: 'C' },
  { key: 'c++', language: 'C++' },
  { key: 'go', language: 'Go' },
  { key: 'json', language: 'JSON' },
  { key: 'php', language: 'PHP' },
  { key: 'python', language: 'Python' },
  { key: 'ruby', language: 'Ruby' },
  { key: 'rust', language: 'Rust' },
  { key: 'sql', language: 'SQL' },
  { key: 'shell', language: 'Shell Session' },
  { key: 'vb', language: 'Visual Basic' },
]