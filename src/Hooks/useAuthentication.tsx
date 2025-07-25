import { useEffect, useRef, useState } from "react";
import navigator from "../Navigation/NavigationService";
import { useAppDispatch } from "../Store/ReduxStore";
import { getCurrentUser } from "../Services/user";
import AuthStore from "../Store/AuthStore";


type ReturnType = {
    navigate: () => void,
    isVerifying: boolean
}

export default function useAuthentication(): ReturnType {

    const dispatch = useAppDispatch();

    const isAuthenticate = useRef<boolean>(false);
    const isAuthenticating = useRef<boolean>(true);
    const isNeedToNavigate = useRef<boolean>(false);
    
    const [isVerifying, setVerifying] = useState<boolean>(false);
    
    async function handleNavigation() {
        try {
            isAuthenticating.current = true;
            if(!AuthStore.getString('accessToken') || !AuthStore.getString("refreshToken")){
                isAuthenticate.current = false;
                return;
            }
            
            const {payload} = await dispatch(getCurrentUser()) as { payload: { user?: any } };
            isAuthenticate.current = !!payload.user
        } catch(e) {
            console.log(e)
        } finally {
            isAuthenticating.current = false;
            setVerifying(false)
        }
    }


    function navigate() {
        isNeedToNavigate.current = true;
        setVerifying(true);
        if(isAuthenticating.current) return;
        setVerifying(false)
        
        if(isAuthenticate.current) {
            navigator.navigate('tab-navigation');
        } else {
            navigator.navigate('landing-screen');
        }
    }

    useEffect(() => {
        handleNavigation()
    }, [])

    useEffect(() => {
        if(isNeedToNavigate.current) navigate();
    }, [isAuthenticate.current])

    return {navigate, isVerifying}
}