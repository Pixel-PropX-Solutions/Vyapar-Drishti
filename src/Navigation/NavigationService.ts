import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import type { StackParamsList } from './StackNavigation';

const navigation = createNavigationContainerRef<StackParamsList>();
export { navigation as NavigationRef }


export function navigate<RouteName extends keyof StackParamsList>(
  name: RouteName,
  params?: StackParamsList[RouteName]
) {
  if (navigation.isReady()) {
    navigation.navigate(name as any, params);
  }
}



const navigator = {
  navigate,

  goBack: function () {
    if (navigation.isReady() && navigation.canGoBack()) {
      navigation.goBack();
    }
  },

  reset: function (name: keyof StackParamsList, params?: any) {
    if (navigation.isReady()) {
      navigation.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }
  },

  replace: function (name: keyof StackParamsList, params?: any) {
    if (navigation.isReady()) {
      navigation.current?.dispatch(StackActions.replace(name, params))
    }
  },

  currentRouteName: function () {
    return navigation.isReady() ? navigation.getCurrentRoute()?.name : null;
  },

  getParams: function <RouteName extends keyof StackParamsList>(name: RouteName): StackParamsList[RouteName] | undefined {
    if (navigation.isReady()) {
      const route = navigation.getState().routes.find(route => route.name === name);
      return route ? (route.params as StackParamsList[RouteName]) : undefined;
    }
    return undefined;
  }
}

export default navigator