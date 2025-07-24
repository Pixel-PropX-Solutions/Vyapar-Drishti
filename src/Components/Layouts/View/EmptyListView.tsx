/* eslint-disable react-native/no-inline-styles */
import { Animated, useAnimatedValue, View } from 'react-native';
import FeatherIcon from '../../Icon/FeatherIcon';
import TextTheme from '../../Ui/Text/TextTheme';
import { useEffect } from 'react';


type Info = {title: string, text: string}

type InfoObject = {'product': Info, 'customer': Info, 'invoice': Info}

const info: InfoObject = {
    product: {
        title: 'No Products Added',
        text: 'Start by adding your first product to begin managing your inventory and sales.',
    },
    customer: {
        title: 'No Customers Added',
        text: 'Add customer details to keep track of your clients and their purchases.',
    },
    invoice: {
        title: 'No Invoices Created',
        text: 'Generate invoices after making sales to keep your billing organized and professional.',
    },
};


type Props = {title?:string, text?: string, type?: 'invoice' | 'customer' | 'product'}

export default function EmptyListView({title = '', text = '', type}: Props) {

    const animate0to1 = useAnimatedValue(0);

    useEffect(() => {
        Animated.timing(animate0to1, {
            toValue: 1, duration: 500, useNativeDriver: true
        }).start()
    }, [])

    return (
        <Animated.View 
            style={{
                padding: 30, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: animate0to1.interpolate({
                    inputRange: [0, 1], outputRange: [0, 0.6]
                }),
                transform: [{scale: animate0to1.interpolate({
                    inputRange: [0, 1], outputRange: [0.5, 1]
                })}]
            }}
        >
            <FeatherIcon name="inbox" size={38} />
            <TextTheme style={{fontWeight: '900', fontSize: 18, marginTop: 10, marginBottom: 4}}>
                {type ? info[type].title : title}
            </TextTheme>
            <TextTheme isPrimary={false} style={{fontWeight: '800', fontSize: 12, textAlign: 'center', opacity: 0.75}}>
                {type ? info[type].text : text}
            </TextTheme>
        </Animated.View>
    );
}
