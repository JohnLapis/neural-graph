import React, { Component } from 'react'

export class Editor extends Component {
    ref: React.RefObject<HTMLDivElement>

    constructor (props) {
      super(props)
      this.ref = React.createRef()
    }

    componentDidMount () {
      const element = this.ref.current
      element.addEventListener('mousedown', e => e.stopPropagation())
      element.addEventListener('mouseup', e => e.stopPropagation())
      element.addEventListener('mousemove', e => e.stopPropagation())
      Rainbow.color(element, () => {
        const preloader = element?.children?.[1]
        // it prevents preloader from getting in the way of mouse selection
        if (preloader) preloader.hidden = true
      })
    }

    render () {
      const language = 'language-' + (this.props?.language || 'orgmode')
      return (
            <pre
                className="w-100 h-100"
                ref={this.ref}
                contentEditable="true"
                spellCheck="false"
                style={{ cursor: 'text' }}
            >
                <code className={language}>
                    {this.props.children}
                </code>
            </pre>
      )
    }
}
