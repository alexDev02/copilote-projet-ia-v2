export type Route =
  | { readonly name: 'home' }
  | { readonly name: 'context' }
  | { readonly name: 'workflow'; readonly workflowId: string }
  | { readonly name: 'training' }
  | { readonly name: 'training-module'; readonly moduleId: string }
  | { readonly name: 'not-found' };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  const [segment, param] = path.split('/');

  if (!segment || segment === '') return { name: 'home' };
  if (segment === 'context') return { name: 'context' };
  if (segment === 'training' && param) return { name: 'training-module', moduleId: param };
  if (segment === 'training') return { name: 'training' };
  if (segment === 'workflow' && param) return { name: 'workflow', workflowId: param };
  return { name: 'not-found' };
}

type RouteListener = (route: Route) => void;

export function createRouter(onChange: RouteListener): { navigate: (hash: string) => void } {
  const emitCurrent = (): void => onChange(parseHash(window.location.hash));

  window.addEventListener('hashchange', emitCurrent);
  emitCurrent();

  return {
    navigate(hash: string): void {
      window.location.hash = hash;
    },
  };
}
