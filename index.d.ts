import * as React from 'react';

type functionalComponent = (props: any) => React.ReactNode;
type Component = React.Component | React.ComponentClass | React.PureComponent | functionalComponent;

export function withContextConsumer(Component: Component, contexts: {[key: string]: any}): React.ReactNode;

type getContexts = (props: {[key: string]: any}) => Array<{ context: React.Context<any>, value: any }>;

export function withContextProvider(Component: Component, getContexts: getContexts):React.ReactNode;
