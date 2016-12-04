import React, { Component, PropTypes } from 'react'

const isEventHandlerProp = propName => /^on[A-Z]/.test(propName)

const getWrappedWcProps = allProps => {
    const ignorableWrappedWcPropNames = [
        'children',
        'className',
        'webComponentExtends',
        'webComponentHtmlHref',
        'webComponentName',
        'ref'
    ]
    const wrappedMcProps = {}

    Object.keys(allProps).forEach(propName => {
        if (ignorableWrappedWcPropNames.indexOf(propName) < 0
            && !isEventHandlerProp(propName)) {

            const propRawValue = allProps[propName]

            if (typeof propRawValue === 'object') {
                wrappedMcProps[propName] = JSON.stringify(propRawValue)
            }
            else {
                wrappedMcProps[propName] = allProps[propName]
            }
        }
    })

    return wrappedMcProps
}

// TODO tests
class WebComponentWrapper extends Component {
    static defaultProps = {
        className: ''
    };

    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        webComponentExtends: PropTypes.string,
        webComponentHtmlHref: PropTypes.string.isRequired,
        webComponentName: PropTypes.string.isRequired
    };

    constructor() {
        super()

        this._wcEventListeners = {}
    }

    componentDidMount() {
        Object.keys(this.props).forEach(propName => {
            if (isEventHandlerProp(propName)) {
                const eventName = propName[2].toLowerCase() + propName.substr(3)
                const handler = (...args) => {
                    this.props[propName].apply(null, args)
                }

                this._wcEventListeners[eventName] = handler
                this._wcEl.addEventListener(eventName, handler)
            }
        })
    }

    componentWillUnmount() {
        Object.keys(this._wcEventListeners).forEach(eventName => {
            this._wcEl.removeEventListener(eventName, this._wcEventListeners[eventName])
        })
    }

    render() {
        const wrappedMcProps = getWrappedWcProps(this.props)

        const WcTag = this.props.webComponentExtends
            ? this.props.webComponentExtends
            : this.props.webComponentName

        return (
            <span>
                <link rel='import' href={ this.props.webComponentHtmlHref } />
                <WcTag class={ this.props.className }
                       is={ this.props.webComponentExtends ? this.props.webComponentName : '' }
                       ref={ wcEl => this._wcEl = wcEl }
                       { ...wrappedMcProps }
                >
                    { this.props.children }
                </WcTag>
            </span>
        )
    }
}

export default WebComponentWrapper