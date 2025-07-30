/* eslint-disable react-native/no-inline-styles */
import { Animated, useAnimatedValue, View } from 'react-native';
import NormalButton from '../Components/Ui/Button/NormalButton';
import TextTheme from '../Components/Ui/Text/TextTheme';
import LogoImage from '../Components/Image/LogoImage';
import navigator from '../Navigation/NavigationService';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import PingAnimation from '../Components/Ui/Animation/PingAnimation';
import WaveCircle from '../Components/Ui/Animation/RoundedWaveAnimation';
import ScaleAnimationView from '../Components/Ui/Animation/ScaleAnimationView';
import { useEffect } from 'react';
import ParticleBackground from '../Components/Layouts/Background/ParticleBackground';



export default function LandingScreen(): React.JSX.Element {

    const animate0to1 = useAnimatedValue(0);

    useEffect(() => {
        Animated.timing(animate0to1, {
            toValue: 1, duration: 500, useNativeDriver: true
        }).start()
    }, [])
    return (
        <View style={{ width: '100%', height: '100%', paddingInline: 20, justifyContent: "center", alignItems: 'center' }}>   

            <ParticleBackground
                maxSize={110}
                childs={['file-text', 'trending-up', 'bar-chart-2', 'check-circle', 'printer'].map(name => (
                    <ScaleAnimationView useRandomDelay={true} duration={1000} >
                        <FeatherIcon name={name} size={32} color='white' />
                    </ScaleAnimationView>  
                ))}
            />

            <Animated.View style={{transform: [{translateY: animate0to1.interpolate({inputRange: [0,1], outputRange: [120, 0]})}], opacity: animate0to1}} >
                <LogoImage size={200} />      
            </Animated.View>
            
            <ScaleAnimationView delay={500} >
                <View style={{ width: '100%', gap: 6, alignSelf: 'center', position: 'relative'}}>

                    <View style={{position: 'absolute', bottom: '100%', right: -10}} >
                        <ScaleAnimationView delay={1250} >
                            <PingAnimation duration={2500} >
                                <WaveCircle backgroundRgb='50,200,150' style={{width: 100}} >
                                    <FeatherIcon name='file-text' size={32} color='white' />
                                </WaveCircle>
                            </PingAnimation>
                        </ScaleAnimationView>
                    </View>

                    <View style={{position: 'absolute', top: '100%', left: -10}} >
                        <ScaleAnimationView delay={1000} >
                            <PingAnimation >
                                <WaveCircle backgroundRgb='50,150,200' style={{width: 100}} >
                                    <FeatherIcon name='shield' size={32} color='white' />
                                </WaveCircle>
                            </PingAnimation>
                        </ScaleAnimationView>
                    </View>

                    <View style={{ marginBottom: 14, paddingLeft: 6 }}>
            <TextTheme fontWeight={900} fontSize={20} style={{ marginBottom: 4, textAlign: 'center' }} >
                Welcome to Vyapar Drishti
            </TextTheme>

            <TextTheme fontWeight={900} style={{ textAlign: 'center' }} isPrimary={false} >
                Simplify Your GST Billing and Complete GST invoice management with automatic tax calculations.
            </TextTheme>
                    </View>

                    <NormalButton
                        isPrimary={true}
                        text="Get Free Account"
                        textStyle={{ fontWeight: 900, fontSize: 14 }}
                        onPress={() => navigator.navigate('signup-screen')}
                        />

                    <NormalButton
                        isPrimary={false}
                        text="Already Have Account"
                        textStyle={{ fontWeight: 900, fontSize: 14 }}
                        onPress={() => navigator.navigate('login-screen')}
                    />
                </View>  
            </ScaleAnimationView>
        </View>
    );
}