/* eslint-disable react-native/no-inline-styles */
import { useCallback } from 'react';
import LogoImage from '../Components/Image/LogoImage';
import { View } from 'react-native';
import navigator from '../Navigation/NavigationService';
import { isVersionLower } from '../Utils/functionTools';
import useAuthentication from '../Hooks/useAuthentication';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../Components/Ui/Loader';
import { useAppDispatch } from '../Store/ReduxStore';
import { getAppVersion } from '../Services/user';
import { getVersion } from 'react-native-device-info';


export default function SplashScreen(): React.JSX.Element {

    const { navigate } = useAuthentication();
    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(() => {
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
                    });
            }, 1000);
            return () => clearTimeout(timeout);
        }, [])
    );

    return (
        <View style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: 'white' }} >
            <LogoImage size={200} />
            <Loader />
        </View>
    );
}
