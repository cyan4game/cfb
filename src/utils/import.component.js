/**
 * 动态完全引入组件
 */
const requestAll = (context) => context.keys().map(context);
export function importComponent(locales) {
  const component = {};
  requestAll(locales).forEach(({ default: item }) => {
    component[item.name] = item;
  });
  return component;
}
