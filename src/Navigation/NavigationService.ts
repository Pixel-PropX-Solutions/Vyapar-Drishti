// src/Navigation/NavigationRef.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import type { StackParamsList } from './StackNavigation';

const navigation = createNavigationContainerRef<StackParamsList>();
export {navigation as NavigationRef}


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

  goBack: function() {
    if (navigation.isReady() && navigation.canGoBack()) {
      navigation.goBack();
    }
  },
  
  replace: function(name: keyof StackParamsList, params?: any) {
    if (navigation.isReady()) {
      navigation.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }
  },

  currentRouteName: function() {
    return navigation.isReady() ? navigation.getCurrentRoute()?.name : null;
  }
} 

export default navigator