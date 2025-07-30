import { ScrollView, View } from "react-native";
import AnimateButton from "../../../../Components/Ui/Button/AnimateButton";
import navigator from "../../../../Navigation/NavigationService";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import LoadingView from "../../../../Components/Layouts/View/LoadingView";
import BackgroundThemeView from "../../../../Components/Layouts/View/BackgroundThemeView";
import { BillLoadingCard } from "../../../../Components/Ui/Card/BillCard";
import ScaleAnimationView from "../../../../Components/Ui/Animation/ScaleAnimationView";

export default function LoadinScreen() {
    return (
        <View style={{width: '100%', flex: 1}} >
            <View style={{ gap: 16, paddingInline: 20 }} >
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                    <AnimateButton 
                        style={{aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}} 
                        onPress={() => { navigator.goBack() }}
                    >
                        <FeatherIcon name="chevron-left" size={20} />
                    </AnimateButton>
                    <View>
                        <LoadingView width={100} height={12} style={{ marginBottom: 4 }} />
                        <LoadingView width={80} height={8} />
                    </View>
                </View>

                <ScaleAnimationView>
                    <LoadingView style={{width: '100%'}} height={36} />
                </ScaleAnimationView>
            
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24}} >
                    {
                        [1,2,3,4].map(item => (
                            <ScaleAnimationView key={item} delay={item * 150} >
                                <LoadingView width={60} height={24} borderRadius={40} />
                            </ScaleAnimationView>
                        ))
                    }
                </View>
            </View>

            <BackgroundThemeView isPrimary={false} style={{width: '100%', borderTopRightRadius: 40, borderTopLeftRadius: 40, padding: 20, flex: 1, gap: 20, paddingBottom: 0, marginTop: 8}} >
                    <LoadingView style={{width: '100%', height: 40, borderRadius: 40}} isPrimary={true} />

                    <ScrollView contentContainerStyle={{gap: 12}} showsVerticalScrollIndicator={false} >
                        {
                            [1,2,3,4,5,6,7,8,9].map(item => (
                                <BillLoadingCard key={item} delay={item * 100} />
                            ))
                        }
                    </ScrollView>
            </BackgroundThemeView>

        </View>
    )
}