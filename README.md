# react-with-multiple-contexts [![npm version](https://badge.fury.io/js/react-with-multiple-contexts.svg)](https://badge.fury.io/js/react-with-multiple-contexts)

## Why should I use it?

> **tl;dr** to fix "wrapper hell" while using multiple instance of [React Context API](https://reactjs.org/docs/context.html#api)

> You have to admit that the *React Context API* is a extremely useful, if you need to get props from parent component to child component, and between them is a whole universe of nested things.
> But this advantage quickly disappears when you need to use more than one context at the same component level.

<details>
  <summary>Click here and you will see the problem I'm talking about</summary>
  <p>

## Provider

```jsx

import React from 'react';
import { ContextA, ContextB, ContextC } from './contexts';

export class ComponentProvider extends React.Component {
  render() {
    return (
      <ContextA.Provider value={this.props.list}>
        <ContextB.Provider value={this.props.config}>
          <ContextC.Provider value={this.props.theme}>
            {this.props.children}
          </ContextC.Provider>
        </ContextB.Provider>
      </ContextA.Provider>
    )
  }
}

```

## Consumer

```jsx

import React from 'react';
import { ContextA, ContextB, ContextC } from './contexts';

export class ComponentConsumer extends React.Component {
  render() {
    return (
      <ContextA.Consumer>
        {list => (
          <ContextB.Consumer>
          {config => (
            <ContextC.Consumer>
            {themeClass => (
              <React.Fragment>
                <div className={themeClass}>
                  <ol>
                    {list.map(i => (
                      <li key={i}>{i}</li>
                    ))}
                  </ol>
                  <ul>
                    {Object.entries(config).map(([k, v]) => (
                      <li key={k}>{`${k}: ${v}`}</li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            )}
          </ContextC.Consumer>
          )}
        </ContextB.Consumer>
        )}
      </ContextA.Consumer>
    )
  }
}

```

</p></details>

## Well, what the `react-with-multiple-contexts` actually do?

> The package provides you a couple of simple [HOCs](https://reactjs.org/docs/higher-order-components.html): `withContextProvider` and `withContextConsumer`.
> Each HOC return a call tree of *React.Provider* or *React.Consumer*, depending on what you want to receive.
> That *call tree* wrapped around **your component**.
> And finally, your component can now use the *React Context API* via props.

## Install

```console
$ npm install --save-dev react-with-multiple-contexts
```

Or if you prefer using Yarn:

```console
$ yarn add react-with-multiple-contexts --dev
```

## API

### `withContextProvider(ReactComponent, callback)`

`callback` is a function that has the **props** from the Component as an argument and returns a new object that must contain the **context** and the **value** that goes into the context.

### `withContextConsumer(ReactComponent, contexts)`

`contexts` is an object where each *property name* is the name that you can use in your component through the props and get *property value*, which is a context value in your component.

## Usage Example

### Provider Declaration

```jsx
// componentProvider.jsx

import React from 'react';
import { withContextProvider } from 'react-with-multiple-contexts';
import { contextA, contextB, contextC } from './contexts';

const DummyComponent = (props) => (
  // props also has everything that pass through the context
  // such as props.list, props.config and props.theme
  <React.Fragment>{props.children}</React.Fragment>
)

export const ComponentProvider = withContextProvider(DummyComponent, (props) => ([
  // where each context(A|B|C) it's just an empty React.createContext(null)
  { context: contextA, value: props.list },
  { context: contextB, value: props.config },
  { context: contextC, value: props.theme }
]))

```

### Consumer Declaration

```jsx
// componentProvider.jsx

import React from 'react';
import { withContextConsumer } from 'react-with-multiple-contexts';
import { contextA, contextB, contextC } from './contexts';

const DummyComponent = (props) => (
  <div className={props.themeClass}>
    <ol>
      {this.props.list.map(i => (
        <li key={i}>{i}</li>
      ))}
    </ol>
    <ul>
      {Object.entries(this.props.config).map(([k, v]) => (
        <li key={k}>{`${k}: ${v}`}</li>
      ))}
    </ul>
  </div>
};

export const ComponentConsumer = withContextConsumer(DummyComponent, {
  list: contextA,
  config: contextB,
  themeClass: contextC
});
```

### Components Usage

```jsx
// app.jsx

import React from 'react';
import { ComponentProvider } from './componentProvider';
import { ComponentConsumer } from './componentConsumer';

const App = () => {
  const justProps = {
    list: [1,2,3],
    config: {
      cool: true,
      boring: false
    },
    theme: 'dark',
  };

  return (
    <ComponentProvider {...justProps}>
      <div className="app">
          <div className="child">
            {/* 
              Consumer below receives everything
              from Provider's props via React.Context API
            */}
            <ComponentConsumer />
          </div>
        </div>
    </ComponentProvider>
  );
}
```

> P.S. those HOCs also support [Forwarding Refs (16.3+)](https://reactjs.org/docs/forwarding-refs.html)

## License

MIT © [Artem Anikeev](https://artanik.github.io)
