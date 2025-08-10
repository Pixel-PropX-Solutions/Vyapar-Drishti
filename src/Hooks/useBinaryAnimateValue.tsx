import { Animated, useAnimatedValue } from "react-native"


type Props = {
    value: 0 | 1,
    duration: number,
    delay?: number,
    useNativeDriver?: boolean
}


type TimingOptions = {
    duration?: number, delay?: number
}

type AnimationFunction = (timingOption?: TimingOptions, callback?: () => void) => void;

type ReturnType = {
    value: Animated.Value
    animateTo1: AnimationFunction,
    animateTo0: AnimationFunction
}

export default function useBinaryAnimateValue({value: v, duration, delay=0, useNativeDriver=true}: Props): ReturnType {

    const defaultTimingOptions: TimingOptions = {duration, delay}

    const value = useAnimatedValue(v);

    const animateTo1: AnimationFunction = ({duration, delay}=defaultTimingOptions, cb=()=>{}) => {
        Animated.timing(value, {
            toValue: 1, duration, delay, useNativeDriver
        }).start(cb)
    }

    const animateTo0: AnimationFunction = ({duration, delay}=defaultTimingOptions, cb=()=>{}) => {
        Animated.timing(value, {
            toValue: 0, duration, delay, useNativeDriver
        }).start(cb)
    }

    return {
        value,
        animateTo0, animateTo1
    }
}