import React, { Component } from 'react'
import { render } from 'react-dom'
import withFocusProps from './withFocusProps'
import { equal } from 'assert'

describe('withFocusProps', () => {
  it('wraps the name of the original component', () => {
    function Input(props) {
      return <input {...props} />
    }

    const EnhancedInput = withFocusProps({ focus: true })(Input)

    equal(EnhancedInput.displayName, 'withFocusProps(Input)')
  })

  it('has the touch down prop when focus gets triggered', done => {
    const root = document.createElement('div')
    class Target extends Component {
      constructor() {
        super()

        this.updated = false
      }

      componentDidMount() {
        setTimeout(() => {
          this.updated = true
          this.props.onFocus()
        })
      }

      componentDidUpdate() {
        if (this.updated) {
          setTimeout(() => {
            expect(root.querySelector('span').textContent).toBe('Focused!')
            done()
          })
        }
      }

      render() {
        const { label } = this.props

        return (
          <div style={{ backgroundColor: 'red', width: 40, height: 20 }}>
            <span>
              {label}
            </span>
          </div>
        )
      }
    }
    Target.defaultProps = { label: '' }
    const DecoratedTarget = withFocusProps({
      label: 'Focused!',
    })(Target)

    render(<DecoratedTarget />, root)
  })

  it('loses the touch down prop when blur gets triggered', done => {
    const root = document.createElement('div')
    class Target extends Component {
      componentDidMount() {
        this.props.onFocus()
      }

      componentDidUpdate() {
        setTimeout(() => {
          this.props.onBlur()
          setTimeout(() => {
            equal(root.querySelector('span').textContent, '')
            done()
          })
        })
      }

      render() {
        const { label } = this.props
        return (
          <span>
            {label}
          </span>
        )
      }
    }

    Target.defaultProps = { label: '' }
    const DecoratedTarget = withFocusProps({
      label: 'Focused!',
    })(Target)

    render(<DecoratedTarget />, root)
  })
})
