import React from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function enhance (name, fn) {
  fn.displayName = name;
  return React.forwardRef(fn);
}

function withName (Component, props) {
  Component.displayName = getDisplayName(Component);
  return <Component {...props} />;
}

const drop = (a, i = 1) => (a && a.length) ? a.slice(i, a.length) : [];
const head = a => (a && a.length) ? a[0] : undefined;

export function withContextConsumer (Component, contexts) {
  return enhance(`WithContextConsumer(${getDisplayName(Component)})`, (props, ref) => {
    const applyConsumer = (contextEntries, contextProps = {}) => {
      if (contextEntries.length !== 0) {
        const [contextName, ContextComponent] = head(contextEntries);
        return (
          <ContextComponent.Consumer>
            {context => (
              applyConsumer(
                drop(contextEntries),
                { [contextName]: context, ...contextProps },
              )
            )}
          </ContextComponent.Consumer>
        );
      }
      return withName(Component, {...props, ...contextProps, ref})
    };
    return applyConsumer(Object.entries(contexts));
  });
}

export function withContextProvider (Component, getContexts) {
  return enhance(`WithContextProvider(${getDisplayName(Component)})`, (props, ref) => {
    const contexts = getContexts(props);
    const applyProvider = (contexts) => {
      if (contexts.length !== 0) {
        const { context: ContextComponent, value } = head(contexts);
        return (
          <ContextComponent.Provider value={value}>
            {applyProvider(drop(contexts))}
          </ContextComponent.Provider>
        );
      }
      return withName(Component, {...props, ref});
    };
    return applyProvider(contexts);
  });
}
