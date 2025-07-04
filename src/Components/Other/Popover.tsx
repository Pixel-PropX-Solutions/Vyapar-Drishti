import { Animated, useAnimatedValue, View, ViewStyle } from "react-native";
import AnimateButton from "../Button/AnimateButton";
import BackgroundThemeView from "../View/BackgroundThemeView";
import { ReactNode } from "react";


type Props = {
    label: ReactNode,
    icon: ReactNode,
    position: 'top' | 'bottom',
    margin?: number,
    translateX?: number,
    left?: number | 'auto',
    right?: number | 'auto',
    labelLife?: number,
    isPrimary?: boolean,
    style?: ViewStyle
}

export default function Popover({icon, label, position, margin=2, translateX=0, left='auto', right='auto', labelLife=2000, isPrimary=false, style={}}: Props): React.JSX.Element {

    const animate0to1 = useAnimatedValue(0);

    function showLabel(){
        Animated.timing(animate0to1, {
            toValue: 1, duration: 300, useNativeDriver: true
        }).start();
    }

    function hideLabel(){
        setTimeout(() => {
            Animated.timing(animate0to1, {
                toValue: 0, duration: 300, useNativeDriver: true
            }).start()
        }, labelLife + 300)
    }

    return (
        <View style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
            <AnimateButton 
                style={{borderRadius: 100, ...style}} 
                onPressIn={() => showLabel()} onPressOut={() => hideLabel()} 
            > 
                {icon}
            </AnimateButton>

            <Animated.View 
                style={{
                    position: 'absolute', maxWidth: 400,
                    [position === 'top' ? 'bottom' : 'top']: '100%', 
                    left, right,
                    transform: [
                        {translateX},
                        {scale: animate0to1.interpolate({inputRange: [0, 1], outputRange: [0.5, 1]})},
                        {translateY:  animate0to1.interpolate({
                            inputRange: [0,1], outputRange: [0, position === 'top' ? -margin : margin]
                        })}, 
                    ],
                    opacity: animate0to1
                }} 
            >
                <BackgroundThemeView isPrimary={isPrimary} style={{padding: 4, borderRadius: 8, paddingHorizontal: 12}}  >
                    {label}
                </BackgroundThemeView>
            </Animated.View>
        </View>
    )
}