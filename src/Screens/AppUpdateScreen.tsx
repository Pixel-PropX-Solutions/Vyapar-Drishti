/* eslint-disable react-native/no-inline-styles */
import { BASE_APP_URL } from '../../env';
import { Linking, View } from 'react-native';
import ParticleBackground from '../Components/Layouts/Background/ParticleBackground';
import ScaleAnimationView from '../Components/Ui/Animation/ScaleAnimationView';
import BackgroundThemeView from '../Components/Layouts/View/BackgroundThemeView';
import TextTheme from '../Components/Ui/Text/TextTheme';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import NormalButton from '../Components/Ui/Button/NormalButton';
import useDoubleBackExit from '../Hooks/useDoubleBackExit';
import ShowWhen from '../Components/Other/ShowWhen';
import { isVersionLower } from '../Utils/functionTools';
import { getVersion } from 'react-native-device-info';
import useAuthentication from '../Hooks/useAuthentication';
import { useUserStore } from '../Store/ReduxStore';


export default function AppUpdateScreen(): React.JSX.Element {

    useDoubleBackExit();
    const { navigate, isVerifying } = useAuthentication();
    const { minimum_version, latest_version } = useUserStore();
    const isMandotry = isVersionLower(getVersion(), minimum_version);


    return (
        <BackgroundThemeView useInvertTheme={true}
            style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}
        >
            <ParticleBackground />

            <ScaleAnimationView style={{ width: '100%', paddingInline: 20 }} >
                <BackgroundThemeView
                    isPrimary={false}
                    style={{ borderRadius: 20, width: '100%', gap: 20, alignItems: 'center', overflow: 'hidden', padding: 8 }}
                >
                    <BackgroundThemeView style={{ alignSelf: 'flex-start', borderRadius: 12, paddingInline: 14, paddingBlock: 4 }} >
                        <TextTheme isPrimary={false} fontSize={12} >{latest_version}</TextTheme>
                        <TextTheme fontSize={10} >Latest Version</TextTheme>
                    </BackgroundThemeView>

                    <BackgroundThemeView useInvertTheme={true} style={{ padding: 10, borderRadius: 100 }} >
                        <FeatherIcon name="refresh-cw" size={40} useInversTheme={true} />
                    </BackgroundThemeView>

                    <View style={{ alignItems: 'center' }} >
                        <TextTheme fontWeight={900} fontSize={20}>
                            <ShowWhen when={isMandotry} otherwise={'New update is availble'} >
                                Update is Required!
                            </ShowWhen>
                        </TextTheme>

                        <TextTheme isPrimary={false} fontSize={14} style={{ textAlign: 'center' }} >
                            We've added exciting new features and fixed some bugs to improve your experience.
                        </TextTheme>
                    </View>

                    <View style={{ width: '100%', gap: 8, flexDirection: 'row', alignContent: 'center' }}  >
                        <ShowWhen when={!isMandotry} >
                            <View style={{ flex: 1 }} >
                                <NormalButton
                                    isLoading={isVerifying}
                                    isPrimary={false}
                                    text="Not Now"
                                    onPress={() => { navigate(); }}
                                />
                            </View>
                        </ShowWhen>

                        <View style={{ flex: 1 }} >
                            <NormalButton
                                text="Update"
                                onPress={() => {
                                    Linking.openURL(BASE_APP_URL);
                                }}
                            />
                        </View>
                    </View>
                </BackgroundThemeView>
            </ScaleAnimationView>
        </BackgroundThemeView>
    );
}
