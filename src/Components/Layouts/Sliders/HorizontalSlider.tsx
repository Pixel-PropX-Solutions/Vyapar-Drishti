import { Animated, Image, View } from "react-native";
import BackgroundThemeView from "../View/BackgroundThemeView";
import useBinaryAnimateValue from "../../../Hooks/useBinaryAnimateValue";
import { useEffect, useState } from "react";


type Props = {
    slides: Array<string>,
    width?: number | `${number}%`,
    height?: number | `${number}%`,
    duration?: number
}

export default function HorizontalSlider({slides, width='100%', height=120, duration=10000}: Props): React.JSX.Element {

    const animation1 = useBinaryAnimateValue({value: 1, duration: 900});
    const animation2 = useBinaryAnimateValue({value: 0, duration: 900});

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [nextIndex, setNextIndex] = useState<number>(slides.length === 0 ? 0 : 1);


    function loop(val: 0 | 1) {
        setTimeout(() => {
            loop(val ? 0 : 1)
        }, duration);        

        if(slides.length === 0) return;

        if(val === 0) {
            animation1.animateTo0({}, () => {
                setCurrentIndex(pre => (2 + pre) % slides.length);
            });
            animation2.animateTo1();
        } else {
            animation1.animateTo1();
            animation2.animateTo0({}, () => {
                setNextIndex(pre => (2 + pre) % slides.length);
            });
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            loop(0);
        }, duration);

        return () => clearTimeout(timeout);
    }, [])

    return (
        <View style={{width, flexDirection: 'row', alignItems: 'center', gap: 20, position: 'relative', height}} >
            <Animated.View 
                style={{
                    width: '100%', height: '100%',
                    position: 'absolute', opacity: animation1.value,
                    transform: [{scale: animation1.value.interpolate({
                        inputRange: [0, 1], outputRange: [0.4, 1]
                    })}], 
                }}
            >
                <BackgroundThemeView isPrimary={false} style={{width: "100%", height: '100%', borderRadius: 8, overflow: 'hidden'}}>
                    <Image src={slides[currentIndex]} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </BackgroundThemeView>
            </Animated.View>

            <Animated.View 
                style={{
                    width: '100%', height: '100%',
                    position: 'absolute', opacity: animation2.value,
                    transform: [{scale: animation2.value.interpolate({
                        inputRange: [0, 1], outputRange: [0.4, 1]
                    })}], 
                }}
            >
                <BackgroundThemeView isPrimary={false} style={{width: "100%", height: '100%', borderRadius: 8, overflow: 'hidden'}}>
                    <Image src={slides[nextIndex]} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </BackgroundThemeView>
            </Animated.View>
        </View>
    )
}