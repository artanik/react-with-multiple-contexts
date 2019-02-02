import * as React from 'react';
import { expectType } from 'tsd-check';
import { withContextConsumer, withContextProvider } from '.';

export const context = React.createContext({});

class Component extends React.Component {
  render() {
    return React.createElement('div', null, this.props.children);
  }
}

const DummyComponent = () => React.createElement('div');

expectType<React.ReactNode>(withContextConsumer(Component, { context }));
expectType<React.ReactNode>(withContextProvider(DummyComponent, ({ value }) => ([
  { context, value }
])));
