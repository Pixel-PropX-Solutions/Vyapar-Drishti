import { Animated, Text, TextStyle, useAnimatedValue } from "react-native"
import AnimateButton from "./AnimateButton"
import { useTheme } from "../../Contexts/ThemeProvider"
import React, { useEffect, useRef } from "react"
import ShowWhen from "../Other/ShowWhen"

type Props = {
    text: string,
    isPrimary?: boolean,
    onPress?: () => void,
    textStyle?: TextStyle,
    color?: string,
    backgroundColor?: string,
    height?: number,
    icon?: React.ReactNode,
    spinnerWeight?: number,
    isLoading?: boolean,
    onLoadingText?: string
}

export default function NormalButton({text, isPrimary=true, onPress, color, backgroundColor, textStyle, height=44, icon, spinnerWeight=6, isLoading=false, onLoadingText='Wait'}: Props){

    const {primaryBackgroundColor, primaryColor} = useTheme();

    color = color ?? primaryBackgroundColor;
    backgroundColor = backgroundColor ?? primaryColor;

    const animate0to1 = useAnimatedValue(0);
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        animationRef.current = Animated.loop(
            Animated.timing(animate0to1, {
                toValue: 1, duration: 800, useNativeDriver: true
            })
        )
    }, [animationRef])

    useEffect(() => {
        if(!animationRef.current) return;

        isLoading ? animationRef.current.start() : animationRef.current.stop()
    }, [isLoading])

    return (
        <AnimateButton 
            onPress={isLoading ? ()=>{} : onPress}
            bubbleColor={isPrimary ? color : backgroundColor}
            style={{
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
                paddingInline: 20, height, borderRadius: 12, gap: 12,
                backgroundColor: isPrimary ? backgroundColor : 'transparent',
                borderWidth: isPrimary ? 0 : 2,
                borderColor: isPrimary ? color : backgroundColor
            }}
        >
            <ShowWhen when={isLoading} otherwise={icon}>
                <Animated.View style={{
                    width: 20, aspectRatio: 1, borderRadius: 40, borderWidth: spinnerWeight, 
                    borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent',
                    borderTopColor: isPrimary ? color : backgroundColor, 
                    transform: [{rotate: animate0to1.interpolate({
                        inputRange: [0, 1], outputRange: ['0deg', '360deg']
                    })}]
                }} />
            </ShowWhen>

            <Text style={[textStyle, { color: isPrimary ? color : backgroundColor }]}>
                {isLoading ? onLoadingText : text}
            </Text>
        </AnimateButton>
    )   
}
