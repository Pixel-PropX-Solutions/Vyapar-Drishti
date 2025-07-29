import { useEffect } from "react";
import { Animated, ScrollView, useAnimatedValue, View, ViewStyle } from "react-native";
import BackgroundThemeView from "../View/BackgroundThemeView";
import { useTheme } from "../../../Contexts/ThemeProvider";
import TextTheme from "../../Ui/Text/TextTheme";
import ShowWhen from "../../Other/ShowWhen";

type Props = {
    height: number,
    data: number[][],
    labels?: string[],
    gap?: number,
    color?: string[],
    backgroundColor?: string,
    useInverTheme?: boolean,
    isPrimary?: boolean,
    style?: ViewStyle
}

export default function BarGraph({height, data, color, gap=20, backgroundColor, style, labels, useInverTheme=false, isPrimary=true}: Props): React.JSX.Element {

    const {primaryColor, primaryBackgroundColor} = useTheme()

    const maxHeight = Math.max(...data.flat());
    const scaleRatio = height / maxHeight;

    data = data.map(item => item.map(val => val * scaleRatio ))

    if(!color) {
        const rgb = (useInverTheme ? primaryBackgroundColor :  primaryColor).replace('rgb(','rgba(')
        color = data[0].map((_, i) => rgb.replace(')', `, ${(10 - 2 * i) / 10})`))
    }

    return (
        <BackgroundThemeView 
            isPrimary={isPrimary}
            backgroundColor={backgroundColor} 
            useInvertTheme={useInverTheme}
            style={style}
        >
            <ScrollView  
                horizontal={true}
                style={{width: '100%', minHeight: height}}
                contentContainerStyle={{flexDirection: 'row', alignItems: 'flex-end', gap}}
                showsHorizontalScrollIndicator={false}
            >
                {
                    data.map((item, i1) => (
                        <View key={i1} style={{alignItems: 'center'}} >
                            <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 4}} >
                                {
                                    item.map((val, i2) => (
                                        <Bar key={i2} height={val} color={color[i2] ?? primaryColor} />
                                    ))
                                }
                            </View>
                            
                            <ShowWhen when={!!labels?.at(i1)} >
                                <TextTheme isPrimary={false} style={{fontSize: 12}} >{labels?.at(i1)}</TextTheme>
                            </ShowWhen>
                        </View>
                    ))
                }
            </ScrollView>
        </BackgroundThemeView>
    )
}


type BarProps = {
    height: number,
    color: string
}

function Bar({height, color}: BarProps) {
    const animate0to1 = useAnimatedValue(0);

    useEffect(() => {
        Animated.timing(animate0to1, {
            toValue: 1, duration: 500, useNativeDriver: true
        }).start()
    }, [height])

    return (
        <Animated.View  
            style={{
                width: 8, height, backgroundColor: color, borderRadius: 2, transformOrigin: 'bottom',
                transform: [{scaleY: animate0to1}]
            }}
        />
    )
}
