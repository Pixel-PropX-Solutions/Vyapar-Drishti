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


export function goBack() {
  if (navigation.isReady() && navigation.canGoBack()) {
    navigation.goBack();
  }
}
