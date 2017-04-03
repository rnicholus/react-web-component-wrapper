# react-web-component-wrapper

Easily integrate a Web Component into your project using familiar React conventions.

**In Progress: Coming Soon!**

# Example Usage

An example of using this to wrap a <file-input> custom element:

    import React, { Component } from 'react'
    import WebComponentWrapper from 'web-component-wrapper'

    const extensions = [
      'jpg',
      'jpeg'
    ]

    class FileInputDemo extends Component {
      render() {
        return (
          <WebComponentWrapper webComponentName='file-input'
                               webComponentHtmlHref='file-input.html'
                               extensions={ extensions }
                               onChange={ event => console.log(event.detail) }
          >
            Select Files
          </WebComponentWrapper>
        )
      }
    }
