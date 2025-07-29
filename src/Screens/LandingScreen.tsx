/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import NormalButton from '../Components/Ui/Button/NormalButton';
import TextTheme from '../Components/Ui/Text/TextTheme';
import LogoImage from '../Components/Image/LogoImage';
import navigator from '../Navigation/NavigationService';
import BackgroundThemeView from '../Components/Layouts/View/BackgroundThemeView';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import PingAnimation from '../Components/Ui/Animation/PingAnimation';
import WaveCircle from '../Components/Ui/Animation/RoundedWaveAnimation';
import ScaleAnimationView from '../Components/Ui/Animation/ScaleAnimationView';
import IoniconsIcon from '../Components/Icon/IoniconsIcon';
import BarGraph from '../Components/Layouts/Graphs/BarGraph';



export default function LandingScreen(): React.JSX.Element {
    return (
        <View style={{ width: '100%', height: '100%', paddingInline: 20, justifyContent: "space-between" }}>          
            <Header/>
            <HeroSection/>
            <AccountOptions/>    
        </View>
    );
}




function Header() {
    return (
        <View style={{ position: 'relative', width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20 }} >
            <LogoImage size={56} borderRadius={50} />
            <View>
                <TextTheme style={{ fontWeight: 900, fontSize: 16 }} >Vyapar Drishti</TextTheme>
                <TextTheme isPrimary={false} style={{fontSize: 12 }} >Smart Billing Solutions</TextTheme>
            </View>
        </View>
    )   
}



function HeroSection() {
    return (
        <ScrollView style={{width: '100%', flex: 1}} contentContainerStyle={{gap: 12}}  >
            <View style={{padding: 12, borderRadius: 12, alignItems: 'center', position: 'relative'}} >
                <View style={{alignItems: 'center'}} >
                    <TextTheme style={{fontSize: 32, fontWeight: 900}}>Simplify Your</TextTheme>
                    <TextTheme color='rgb(50,150,200)' style={{fontSize: 32, fontWeight: 900}} >Invoices</TextTheme>
                </View>
                
                <View style={{alignItems: 'center'}} >
                    <TextTheme isPrimary={false} >
                        Create professional invoices, manage,
                    </TextTheme>
                    <TextTheme isPrimary={false} >
                        and grow your business with
                    </TextTheme>
                    <TextTheme isPrimary={false} >
                        Vyapar Drishti
                    </TextTheme>
                </View>

                <View style={{position: 'absolute', top: 0, left: -10}} >
                    <PingAnimation >
                        <WaveCircle backgroundRgb='50,150,200' style={{width: 100}} >
                            <FeatherIcon name='shield' size={32} color='white' />
                        </WaveCircle>
                    </PingAnimation>
                </View>
            </View>

            <BackgroundThemeView isPrimary={false} style={{width: '100%', position: 'relative', gap: 20, padding: 12, borderRadius: 12}} >
                <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingInline: 12}} >
                    <TextTheme style={{fontSize: 14, fontWeight: 900}} >Monthly Overview</TextTheme>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}} >
                    <ScaleAnimationView style={{flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: 'rgb(220,240,250)', padding: 12, borderRadius: 12, flex: 1}} >
                        <BackgroundThemeView style={{width: 40, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                            <FeatherIcon name='trending-up' size={20} color='rgb(50,150,200)' />
                        </BackgroundThemeView>
                        <View>
                            <TextTheme style={{fontSize: 16}} >10,000 INR</TextTheme>
                            <TextTheme isPrimary={false} >Sales</TextTheme>
                        </View>
                    </ScaleAnimationView>
                    
                    <ScaleAnimationView style={{flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: 'rgb(220,250,240)', padding: 12, borderRadius: 12, flex: 1}} >
                        <BackgroundThemeView style={{width: 40, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                            <FeatherIcon name='file-text' size={20} color='rgb(50,200,150)' />
                        </BackgroundThemeView>
                        <View>
                            <TextTheme style={{fontSize: 16}} >124</TextTheme>
                            <TextTheme isPrimary={false} >Invoices</TextTheme>
                        </View>
                    </ScaleAnimationView>
                </View>

                <View style={{gap: 4, position: 'relative'}} >
                    <BarGraph
                        height={100}
                        gap={28}
                        style={{padding: 12, borderRadius: 12}}
                        color={['rgb(50,150,200)', 'rgb(50,200,150)']}
                        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                        data={
                            Array.from({length: 12}, (_, i) => 
                                Array.from({length: 2}, () => 
                                    Math.floor(Math.random() * 90 + 10)
                                )
                            )
                        }
                    />
                </View>
                
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}} >
                    <ScaleAnimationView style={{gap: 4, alignItems: 'center', backgroundColor: 'rgb(220,240,250)', padding: 12, borderRadius: 12, flex: 1}} >
                        <IoniconsIcon name='calculator-outline' size={20} color='rgb(50,150,200)' />
                        <TextTheme isPrimary={false} >Sales</TextTheme>
                    </ScaleAnimationView>
                    
                    <ScaleAnimationView style={{gap: 4, alignItems: 'center', backgroundColor: 'rgb(220,250,240)', padding: 12, borderRadius: 12, flex: 1}} >
                        <FeatherIcon name='pie-chart' size={20} color='rgb(50,200,150)' />
                        <TextTheme isPrimary={false} >Report</TextTheme>
                    </ScaleAnimationView>
                    
                    <ScaleAnimationView style={{gap: 4, alignItems: 'center', backgroundColor: 'rgba(230, 220, 250, 1)', padding: 12, borderRadius: 12, flex: 1}} >
                        <FeatherIcon name='bar-chart-2' size={20} color='rgb(180, 150, 200)' />
                        <TextTheme isPrimary={false} >Analytics</TextTheme>
                    </ScaleAnimationView>             
                </View>

                <View style={{position: 'absolute', top: -50, right: -10}} >
                    <PingAnimation duration={2500} >
                        <WaveCircle backgroundRgb='50,200,150' style={{width: 100}} >
                            <FeatherIcon name='file-text' size={32} color='white' />
                        </WaveCircle>
                    </PingAnimation>
                </View>
            </BackgroundThemeView> 
        </ScrollView>
    )
}




function AccountOptions() {
    return (
        <View style={{ width: '100%', gap: 6, paddingBlock: 10, alignSelf: 'center'}}>
            <BackgroundThemeView style={{position: 'absolute', width: '100%', height: '100%', opacity: 0.5}} />
            <View style={{ marginBottom: 14, paddingLeft: 6 }}>
                <TextTheme style={{ fontWeight: 900, fontSize: 20, marginBottom: 4 }} >
                    Welcome to Vyapar Drishti
                </TextTheme>

                <TextTheme style={{ fontWeight: 900 }} isPrimary={false} >
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
    )
}