import { useEffect } from "react";
import { Animated, useAnimatedValue } from "react-native";
import { useTheme } from "../../../Contexts/ThemeProvider";

type Props = {
    size: number;
    borderWidth?: number;
    duration?: number
}

export default function AnimateSpinner({size=40, borderWidth=4, duration=1000}: Props): React.JSX.Element {

    const {primaryColor, secondaryBackgroundColor} = useTheme();

    const animate0to1 = useAnimatedValue(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(animate0to1, {
                toValue: 1, duration, useNativeDriver: true
            })
        ).start();
    }, [])

    return (
        <Animated.View style={{
            width: size, aspectRatio: 1, borderRadius: size, borderWidth, 
            borderTopColor: primaryColor, 
            borderRightColor: secondaryBackgroundColor, 
            borderBottomColor: secondaryBackgroundColor, 
            borderLeftColor: secondaryBackgroundColor, 
            transform: [{rotate: animate0to1.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            })}]
        }}  /> 
    )
}