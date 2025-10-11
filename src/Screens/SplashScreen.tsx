/* eslint-disable react-native/no-inline-styles */
import { useCallback, useState } from 'react';
import LogoImage from '../Components/Image/LogoImage';
import navigator from '../Navigation/NavigationService';
import { isVersionLower } from '../Utils/functionTools';
import useAuthentication from '../Hooks/useAuthentication';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../Components/Ui/Loader';
import { useAppDispatch } from '../Store/ReduxStore';
import { getAppVersion } from '../Services/user';
import { getVersion } from 'react-native-device-info';
import TextTheme from '../Components/Ui/Text/TextTheme';
import BackgroundThemeView from '../Components/Layouts/View/BackgroundThemeView';


export default function SplashScreen(): React.JSX.Element {

    const { navigate } = useAuthentication();
    const dispatch = useAppDispatch();
    const [showSlowMessage, setShowSlowMessage] = useState(false);

    useFocusEffect(
        useCallback(() => {
            // Timer for showing slow message
            const msgTimer = setTimeout(() => {
                setShowSlowMessage(true);
            }, 3000); // show after 3s (adjust as needed)

            const timeout = setTimeout(() => {
                dispatch(getAppVersion())
                    .then((res) => {
                        if (isVersionLower(getVersion(), res.payload.latest_version)) {
                            navigator.reset('app-update-screen');
                        } else {
                            navigate();
                        }
                    })
                    .catch(() => {
                        navigate();
                    })
                    .finally(() => {
                        clearTimeout(msgTimer); // cancel slow message if API finishes
                        setShowSlowMessage(false);
                    });
            }, 1000);

            return () => {
                clearTimeout(timeout);
                clearTimeout(msgTimer);
            };
        }, [dispatch, navigate])
    );

    return (
        <BackgroundThemeView style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }} >
            <LogoImage size={200} />
            <Loader color="black" />
            {showSlowMessage && (
                <TextTheme color="black" style={{ marginTop: 16 }}>
                    Taking longer than usual. Please wait...
                </TextTheme>
            )}
        </BackgroundThemeView>
    );
}
