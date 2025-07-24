import { ScrollView, View } from "react-native";
import EntityInfoHeader from "../../../../Components/Layouts/Header/EntityInfoHeader";
import TextTheme from "../../../../Components/Ui/Text/TextTheme";
import SectionView, { SectionRow } from "../../../../Components/Layouts/View/SectionView";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import BackgroundThemeView from "../../../../Components/Layouts/View/BackgroundThemeView";
import NormalButton from "../../../../Components/Ui/Button/NormalButton";

export default function BillInfoScreen(): React.JSX.Element {
    return (
        <View style={{gap: 12, height: '100%'}} >
            <View style={{flex: 1}} >
                <EntityInfoHeader 
                    onPressDelete={() => {}} 
                    onPressEdit={() => {}}
                />
                
                <ScrollView contentContainerStyle={{paddingHorizontal: 20, gap: 28}} >
                    <TextTheme style={{fontSize: 38, fontWeight: 900, marginBottom: 20, marginTop: 10}} >Invoce</TextTheme>

                    <SectionView label="Info" labelMargin={4}>
                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <View>
                                <TextTheme isPrimary={false} style={{fontSize: 10, fontWeight: 900}} >Bill number</TextTheme>
                                <TextTheme style={{fontSize: 14, fontWeight: 900}} >INV-0001</TextTheme>
                            </View>

                            <View style={{alignItems: 'flex-end'}}>
                                <TextTheme style={{fontSize: 14, fontWeight: 900}} >Jan 12, 2025</TextTheme>
                                <TextTheme isPrimary={false} style={{fontSize: 10, fontWeight: 900}} >Create On</TextTheme>
                            </View>
                        </SectionRow>
                    </SectionView>
                    
                    <SectionView label="To" labelMargin={4} >
                        <SectionRow >
                            <View style={{flex: 1, gap: 12}} >
                                <View > 
                                    <TextTheme style={{fontSize: 14, fontWeight: 900}} >Customer Name</TextTheme>
                                    <TextTheme isPrimary={false} style={{fontSize: 10, fontWeight: 900}} >Customer Type</TextTheme>
                                </View>

                                <View style={{gap: 4}}>
                                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }} >
                                        <FeatherIcon isPrimary={false} name="phone" size={12} />
                                        <TextTheme isPrimary={false} style={{ fontSize: 12 }} >+91 XXXXX-XXXXX</TextTheme>
                                    </View>
                                    
                                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }} >
                                        <FeatherIcon isPrimary={false} name="mail" size={12} />
                                        <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 900}} >mail@gmail.com</TextTheme>
                                    </View>

                                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }} >
                                        <FeatherIcon isPrimary={false} name="map-pin" size={12} />
                                        <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 900}} >Customer address</TextTheme>
                                    </View>
                                </View>
                            </View>
                        </SectionRow>
                    </SectionView>

                    <SectionView label="Items" labelMargin={4} style={{gap: 12}} >
                        {
                            [1,2,3,4,5].map(item => (         
                                <BackgroundThemeView key={item} isPrimary={false} style={{padding: 12, borderRadius: 8, gap: 8}} >
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} >
                                        <View>
                                            <TextTheme style={{fontSize: 14, fontWeight: 900}} >Item Name</TextTheme>
                                            <TextTheme isPrimary={false} style={{fontSize: 10, fontWeight: 900}} >HSN code</TextTheme>
                                        </View>
                                        
                                        <View style={{alignItems: 'flex-end'}} > 
                                            <TextTheme isPrimary={false} style={{fontSize: 10, fontWeight: 900}} >Sell quantity</TextTheme>
                                            <TextTheme style={{fontSize: 14, fontWeight: 900}} >0 Unit</TextTheme>
                                        </View>
                                    </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <View>
                                            <TextTheme style={{fontSize: 14, fontWeight: 900}} >100.00 INR</TextTheme>
                                            <TextTheme isPrimary={false} style={{fontSize: 10, fontWeight: 900}} >Item Price</TextTheme>
                                        </View>
                                        
                                        <View style={{alignItems: 'flex-end'}} >
                                            <TextTheme isPrimary={false} style={{fontSize: 10, fontWeight: 900}} >Sub Total</TextTheme>
                                            <TextTheme style={{fontSize: 14, fontWeight: 900}} >100.00 INR</TextTheme>
                                        </View>
                                    </View>
                                </BackgroundThemeView>
                            ))
                        }
                    </SectionView>
                </ScrollView>
            </View>

            <BackgroundThemeView isPrimary={false} style={{padding: 12, borderRadius: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderWidth: 2, gap: 4}} >

                <SectionRow isPrimary={true} style={{justifyContent: 'space-between'}} >
                    <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Sub Total</TextTheme>
                    <TextTheme style={{ fontWeight: 900, fontSize: 16 }} >10,000.00 {'INR'}</TextTheme>
                </SectionRow>

                <SectionRow isPrimary={true} style={{justifyContent: 'space-between'}} >
                    <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Tax</TextTheme>
                    <TextTheme style={{ fontWeight: 900, fontSize: 16 }} >100.00 {'INR'}</TextTheme>
                </SectionRow>
                
                <SectionRow isPrimary={true} style={{justifyContent: 'space-between'}} >
                    <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >grand Total</TextTheme>
                    <TextTheme style={{ fontWeight: 900, fontSize: 16 }} >10,100.00 {'INR'}</TextTheme>
                </SectionRow>

                <View style={{flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16}} >
                    <View style={{flex: 1}} >
                        <NormalButton 
                            text="share" 
                            color="white"
                            backgroundColor="rgb(50,150,200)"
                            icon={<FeatherIcon color="white" name="share-2" size={16} />} 
                            textStyle={{fontSize: 16, fontWeight: 900}} 
                        />
                    </View>

                    <View style={{flex: 1}} >
                        <NormalButton 
                            text="Print"  
                            color="white"
                            backgroundColor="rgb(50,200,150)"
                            icon={<FeatherIcon color="white" name="printer" size={16} />} 
                            textStyle={{fontSize: 16, fontWeight: 900}} 
                        />
                    </View>
                </View>
            </BackgroundThemeView>
        </View>
    )
}