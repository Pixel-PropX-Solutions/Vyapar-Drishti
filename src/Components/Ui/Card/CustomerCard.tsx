/* eslint-disable react-native/no-inline-styles */
import { Animated, useAnimatedValue, View } from "react-native";
import TextTheme from "../Text/TextTheme";
import FeatherIcon from "../../Icon/FeatherIcon";
import { useTheme } from "../../../Contexts/ThemeProvider";
import AnimateButton from "../Button/AnimateButton";
// import numberToString from "../../Functions/Numbers/numberToString";
import ShowWhen from "../../Other/ShowWhen";
import LoadingView from "../../Layouts/View/LoadingView";
import { sliceString } from "../../../Utils/functionTools";
import { useEffect } from "react";
import BackgroundThemeView from "../../Layouts/View/BackgroundThemeView";
import ScaleAnimationView from "../Animation/ScaleAnimationView";
// import BackgroundThemeView from "../View/BackgroundThemeView";


type CustomerCardProps = {
    name: string,
    groupName: string,
    createOn: string,
    phoneNo?: string,
    onPress?: () => void,
    backgroundColor?: string,
    color?: string
}

export default function CustomerCard({ name, groupName, createOn, phoneNo = '', onPress = () => {}, backgroundColor = '' }: CustomerCardProps): React.JSX.Element {

    const { secondaryBackgroundColor, primaryBackgroundColor } = useTheme();
    backgroundColor = backgroundColor || secondaryBackgroundColor;

    return (
        <ScaleAnimationView useRandomDelay={true} >
            <AnimateButton
                style={{ padding: 12, borderRadius: 16, backgroundColor }} bubbleScale={30}
                onPress={onPress}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ borderRadius: 50, aspectRatio: 1, width: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: primaryBackgroundColor, backgroundColor }} >
                            <TextTheme fontSize={18} fontWeight={900}>{name[0]}</TextTheme>
                        </View>

                        <View>
                            <TextTheme fontSize={18} fontWeight={900}>{sliceString(name, 20)}</TextTheme>
                            <TextTheme fontSize={12}>{groupName}</TextTheme>
                        </View>
                    </View>

                    <View style={{ alignItems: 'flex-end' }} >
                        <ShowWhen when={phoneNo !== ''} >
                            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }} >
                                <TextTheme isPrimary={false} fontSize={12}>{phoneNo}</TextTheme>
                                <FeatherIcon isPrimary={false} name="phone" size={12} />
                            </View>
                        </ShowWhen>

                        <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }} >
                            <TextTheme isPrimary={false} fontSize={12}>{createOn.split('T')[0]}</TextTheme>
                            <FeatherIcon isPrimary={false} name="calendar" size={12} />
                        </View>
                    </View>
                </View>
            </AnimateButton>
        </ScaleAnimationView>
    )
}




export function CustomerLoadingView({isPrimary=false}): React.JSX.Element {
    return (
        <ScaleAnimationView useRandomDelay={true} >
            <BackgroundThemeView isPrimary={isPrimary} style={{padding: 12, borderRadius: 16, gap: 4}} >
                <LoadingView height={14} width={150} isPrimary={!isPrimary} />
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}} >
                    <LoadingView height={12} width={80} isPrimary={!isPrimary} />
                    <LoadingView height={12} width={60} isPrimary={!isPrimary} />
                </View>     
            </BackgroundThemeView>
        </ScaleAnimationView>
    )
}