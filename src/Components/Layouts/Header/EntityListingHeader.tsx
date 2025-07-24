import { View } from "react-native"
import TextTheme from "../../Ui/Text/TextTheme"
import AnimateButton from "../../Ui/Button/AnimateButton"
import FeatherIcon from "../../Icon/FeatherIcon"
import navigator from "../../../Navigation/NavigationService"
import ShowWhen from "../../Other/ShowWhen"
import AnimatePingBall from "../View/AnimatePingBall"
import BackgroundThemeView from "../View/BackgroundThemeView"

type Props = {
    title: string,
    hasBackButton?: boolean,
    onPressNotification?: () => void
    onPressFilter?: () => void,
    onPressSearch?: () => void,
}

export default function EntityListingHeader({title, onPressFilter, onPressSearch, onPressNotification, hasBackButton=false}: Props): React.JSX.Element {
    return (
        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', paddingBlock: 10, justifyContent: 'space-between' }} >
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}} >
                <ShowWhen when={hasBackButton} >
                    <AnimateButton onPress={() => {navigator.goBack()}} style={{aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}} >
                        <FeatherIcon name='chevron-left' size={20} />
                    </AnimateButton>
                </ShowWhen>

                <TextTheme style={{fontSize: 18, fontWeight: 900}} >{title}</TextTheme>
            </View>

            <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}} >
                <ShowWhen when={!!onPressFilter} >
                    <AnimateButton onPress={onPressFilter} style={{aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}} >
                        <FeatherIcon name='filter' size={20} />
                    </AnimateButton>
                </ShowWhen>

                <ShowWhen when={!!onPressSearch} >
                    <AnimateButton onPress={onPressSearch} style={{aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}} >
                        <FeatherIcon name='search' size={20} />
                    </AnimateButton>
                </ShowWhen>
                
                <ShowWhen when={!!onPressNotification} >
                    <AnimateButton
                        onPress={() => navigator.navigate('notification-screen')}
                        style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                    >
                        <FeatherIcon name="bell" size={20} />
                        <BackgroundThemeView style={{
                            position: 'absolute',
                            transform: [{ translateX: 5 }, { translateY: -5 }],
                            borderRadius: '50%',
                            padding: 2,
                        }} >
                            <AnimatePingBall size={7} scale={2} duration={500} backgroundColor={'rgb(250,50,50)'} />
                        </BackgroundThemeView>
                    </AnimateButton>
                </ShowWhen>
            </View>
        </View>
    )
}