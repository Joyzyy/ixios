type RequiredParameter<T> = T extends () => unknown ? never : T;
export function Show<T>(props: {
  when: T | undefined | null | false;
  fallback?: JSX.Element;
  children: JSX.Element | RequiredParameter<() => JSX.Element>;
}): JSX.Element {
  return <>{props.when ? props.children : props.fallback}</>;
}
