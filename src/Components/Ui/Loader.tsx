/* eslint-disable react-native/no-inline-styles */
import { useEffect } from 'react';
import { Animated, ViewProps, ViewStyle, useAnimatedValue } from 'react-native';
import { useTheme } from '../../Contexts/ThemeProvider';

type Props = ViewProps & {
    width?: number,
    duration?: number,
    isPrimary?: boolean,
    style?: ViewStyle,
    spinnerWeight?: number
    color?: string
}

export default function Loader({ width = 20, duration = 1000, isPrimary = false, style, spinnerWeight = 2, color = '' }: Props): React.JSX.Element {

    const { primaryColor, secondaryColor } = useTheme();

    const animate0to1 = useAnimatedValue(0);

    function startAnimation() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animate0to1, {
                    toValue: 1, useNativeDriver: true, duration,
                }),
                Animated.timing(animate0to1, {
                    toValue: 0, useNativeDriver: true, duration,
                }),
            ])
        ).start();
    }

    useEffect(() => {
        startAnimation();
    }, []);


    return (
        <Animated.View style={[{
            width: width, aspectRatio: 1, borderRadius: 40, borderWidth: spinnerWeight,
            borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderTopColor: !color ? isPrimary ? primaryColor : secondaryColor : color,
            transform: [{
                rotate: animate0to1.interpolate({
                    inputRange: [0, 1], outputRange: ['0deg', '360deg'],
                }),
            }],
        }, style]} />
    );
}
