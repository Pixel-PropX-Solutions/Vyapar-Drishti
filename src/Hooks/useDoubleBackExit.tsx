import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';

export default function useDoubleBackExit(): void {
    const closeOnBack = useRef<boolean>(false);
    const timeout = useRef<NodeJS.Timeout>(undefined);

    const handleOnBackPress = useCallback(() => {
        if (closeOnBack.current) {
            BackHandler.exitApp();
            return false;
        } 

        closeOnBack.current = true;
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

        clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            closeOnBack.current = false;
        }, 2000);

        return true;
    }, []);

    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleOnBackPress);
            return () => backHandler.remove();
        }, [])
    )
};

