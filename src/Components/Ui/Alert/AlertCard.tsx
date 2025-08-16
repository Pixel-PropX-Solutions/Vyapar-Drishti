/* eslint-disable react-native/no-inline-styles */
import { Animated, useAnimatedValue, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Text } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useAlert } from './AlertProvider';
import TextTheme from '../Text/TextTheme';


type AlertIconsInfoType = {
    iconName: string, backgroundColor: string
}

type AlertIconsType = {
    error: AlertIconsInfoType,
    info: AlertIconsInfoType,
    warning: AlertIconsInfoType,
    success: AlertIconsInfoType
}

const alertIconsInfo: AlertIconsType = {
    error: { iconName: 'error-outline', backgroundColor: '220, 53, 70' },
    warning: { iconName: 'warning-amber', backgroundColor: '233, 176, 0' },
    info: { iconName: 'info-outline', backgroundColor: '0, 122, 255' },
    success: { iconName: 'done', backgroundColor: '50, 200, 150' },
};

type Props = {
    id?: string
}


export default function AlertCard({ id }: Props): React.JSX.Element {

    const { alert, setAlert } = useAlert();
    const { type, message, id: alertId, duration: alertDuration } = alert;



    const { iconName, backgroundColor } = type ? alertIconsInfo[type] : { iconName: '', backgroundColor: '' };

    const [isRuning, setRuning] = useState<boolean>(false);

    const widthTranstion = useAnimatedValue(0);
    const transtion0to1 = useAnimatedValue(0);

    function reset() {
        setAlert({ type: null });
        setRuning(false);
    }

    function Animate() {
        setRuning(true);
        Animated.sequence([
            Animated.timing(transtion0to1, {
                toValue: 1, duration: alertDuration, useNativeDriver: true,
            }),
            Animated.timing(widthTranstion, {
                toValue: 1, duration: alertDuration, useNativeDriver: true,
            }),
            Animated.timing(transtion0to1, {
                toValue: 0, duration: alertDuration, useNativeDriver: true,
            }),
        ]).start(() => {
            widthTranstion.setValue(0);
            transtion0to1.setValue(0);
            reset();
        });
    }


    useEffect(() => {
        if (isRuning) { return; }

        if (type && id === alertId) { Animate(); }
    }, [alert]);

    if (type == null || !type) { return <></>; }

    return (
        <View
            style={{
                position: 'absolute', top: 100, width: '100%', maxWidth: 400, height: 80, left: '50%', borderRadius: 16, display: 'flex', paddingInline: 10, alignItems: 'center', justifyContent: 'center', zIndex: 10000,
                transform: [{ translateX: '-50%' }],
            }}
        >
            <Animated.View style={{
                display: 'flex', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: `rgb(${backgroundColor})`, width: '100%', borderRadius: 12, borderWidth: 4, borderColor: `rgba(${backgroundColor}, 0.4)`, position: 'relative', gap: 8, overflow: 'hidden',
                opacity: transtion0to1,
                transform: [{
                    scale: transtion0to1.interpolate({
                        inputRange: [0, 1], outputRange: [0.6, 1],
                    }),
                }],
            }}>
                <MaterialIcons name={iconName} color="white" size={28} />
                <View style={{
                    borderWidth: 0, borderColor: 'white', borderLeftWidth: 2, paddingLeft: 10, display: 'flex', justifyContent: 'center',
                    alignItems: 'center', height: '100%', flex: 1,
                }} >
                    <TextTheme color='white' style={{ alignSelf: 'center' }} numberOfLines={2} >
                        {message}
                    </TextTheme>
                </View>

                <Animated.View style={{
                    height: 4, backgroundColor: 'white', position: 'absolute', bottom: 0, borderRadius: 100,
                    width: '110%',
                    transform: [{ scaleX: widthTranstion }],
                }} />
            </Animated.View>
        </View>
    );
}
