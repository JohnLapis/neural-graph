declare const Rainbow: {
    color: (input: string, language: string, cb: (output: string) => any) => any,
}

interface EditorProps {
    children?: React.ReactNode
    language?: string
}

export class Editor extends React.Component<EditorProps> {
    ref: React.RefObject<HTMLPreElement>

    constructor (props) {
      super(props)
      this.ref = React.createRef()
    }

    componentDidMount () {
      const element = this.ref.current
      if (!element) return
      element.addEventListener('mousedown', e => e.stopPropagation())
      element.addEventListener('mouseup', e => e.stopPropagation())
      element.addEventListener('mousemove', e => e.stopPropagation())
      this.highlightText(element?.children[1])
    }

    highlightText (inputElement) {
      const language = inputElement.dataset.language
      const visibleElement = inputElement.previousElementSibling
      const inputText = inputElement.innerText.replaceAll(/\n\n/g, '\n')
      Rainbow.color(inputText, language, coloredText => {
        visibleElement.innerHTML = coloredText
      })
    }

    render () {
      const language = this.props.language || 'orgmode'
      return (
          <pre className="w-100 h-100" ref={this.ref}>
              <div className="w-100 h-100"
                  style={{
                    position: 'absolute',
                    userSelect: 'none'
                  }}>
              </div>
              <div
                  className="w-100 h-100"
                  data-language={language}
                  contentEditable="true"
                  spellCheck="false"
                  style={{
                    cursor: 'text',
                    position: 'relative',
                    WebkitTextFillColor: 'transparent',
                    color: 'hsl(100, 95%, 95%)',
                    display: 'inline-block'
                  }}
                  onInput={(e) => this.highlightText(e.target)}>
                  {this.props.children}
              </div>
          </pre>
      )
    }
}
