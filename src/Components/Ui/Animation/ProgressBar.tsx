import { useEffect } from "react";
import { Animated, useAnimatedValue, View } from "react-native";
import { useTheme } from "../../../Contexts/ThemeProvider";

export default function ProgressBar({ progress }: { progress: number }): React.JSX.Element {

    const {secondaryBackgroundColor} = useTheme();
    const animate0to1 = useAnimatedValue(0);

    useEffect(() => {
        Animated.timing(animate0to1, {
            toValue: progress, duration: 500, useNativeDriver: true
        }).start();
    }, [progress])

    return (
        <View style={{
            width: '100%',
            height: 5,
            backgroundColor: secondaryBackgroundColor,
            borderRadius: 6,
            overflow: 'hidden',
        }} >
            <Animated.View style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgb(50,200,150)',
                transform: [{ scaleX: animate0to1 }],
                transformOrigin: 'left',
                borderRadius: 6
            }} />
        </View>
    );
}