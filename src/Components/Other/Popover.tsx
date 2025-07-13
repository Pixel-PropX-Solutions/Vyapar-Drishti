/* eslint-disable react-native/no-inline-styles */
import { Animated, useAnimatedValue, View, ViewStyle, Text, Dimensions } from 'react-native';
import AnimateButton from '../Button/AnimateButton';
import BackgroundThemeView from '../View/BackgroundThemeView';
import { ReactNode } from 'react';
import FeatherIcon from '../Icon/FeatherIcon';


type Props = {
    label: string,
    icon?: ReactNode,
    iconSize?: number,
    position?: 'top' | 'bottom',
    alignFrom?: 'right' | 'left',
    labelLife?: number,
    isPrimary?: boolean,
    style?: ViewStyle,
    width?: number,
}

export default function Popover({ icon, label, iconSize=20, position='top', labelLife = 1500, isPrimary = false, style = {}, alignFrom='right', width=400, }: Props): React.JSX.Element {

    const animate0to1 = useAnimatedValue(0);

    function showLabel() {
        Animated.timing(animate0to1, {
            toValue: 1, duration: 300, useNativeDriver: true,
        }).start();
    }

    function hideLabel() {
        setTimeout(() => {
            Animated.timing(animate0to1, {
                toValue: 0, duration: 300, useNativeDriver: true,
            }).start();
        }, labelLife + 300);
    }

    return (
        <View style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <AnimateButton
                style={{ borderRadius: 100, ...style }}
                onPressIn={() => showLabel()} onPressOut={() => hideLabel()}
            >
                {icon ?? <FeatherIcon name='info' size={iconSize} />}
            </AnimateButton>

            <Animated.View
                style={{
                    position: 'absolute',
                    maxWidth: width,
                    minWidth: width,
                    alignItems: 'flex-end',
                    [position === 'top' ? 'bottom' : 'top']: '100%',
                    [alignFrom]: 0,
                    opacity: animate0to1,
                }}
            >
                <BackgroundThemeView isPrimary={isPrimary} style={{ padding: 4, borderRadius: 8, paddingHorizontal: 12,}}  >
                        <Text style={{ fontSize: 14 }}>{label}</Text>
                </BackgroundThemeView>
            </Animated.View>
        </View>
    );
}
