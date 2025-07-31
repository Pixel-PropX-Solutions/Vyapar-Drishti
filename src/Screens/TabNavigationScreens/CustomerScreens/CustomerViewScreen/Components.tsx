import { ScrollView, View } from "react-native";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import TextTheme from "../../../../Components/Ui/Text/TextTheme";
import NormalButton from "../../../../Components/Ui/Button/NormalButton";
import AnimateButton from "../../../../Components/Ui/Button/AnimateButton";
import { useTheme } from "../../../../Contexts/ThemeProvider";
import { useState } from "react";
import navigator from "../../../../Navigation/NavigationService";
import BillCard from "../../../../Components/Ui/Card/BillCard";


export function ProfileSection() {

    const { id } = navigator.getParams('customer-view-screen') ?? {};

    if(!id) return <></>

    return (
        <View style={{ gap: 16 }} >
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                <AnimateButton 
                    style={{aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}} 
                    onPress={() => { navigator.goBack() }}
                >
                    <FeatherIcon name="chevron-left" size={20} />
                </AnimateButton>
                <View>
                    <TextTheme fontWeight={900} fontSize={16}>
                        Customer Name
                    </TextTheme>
                    <TextTheme isPrimary={false} fontWeight={500} fontSize={12}>
                        Group
                    </TextTheme>
                </View>
            </View>

            <NormalButton 
                text='View full Profile' 
                textSize={12} height={36} 
                textWeight={600} isPrimary={false}
                onPress={() => { navigator.navigate('customer-info-screen', {id}) }}
            />
        </View>
    )
}


export function FilterRow(): React.JSX.Element {

    const { primaryColor, primaryBackgroundColor } = useTheme();

    const [selected, setSelected] = useState('All')

    return (
        <View style={{gap: 4, width: '100%'}} >
            <ScrollView
                horizontal={true}
                contentContainerStyle={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
                {
                    ['All', 'Sales', 'Purchase', 'Transaction'].map(type => (
                        <AnimateButton key={type}
                            onPress={() => { setSelected(type) }}
                            bubbleColor={type === selected ? primaryBackgroundColor : primaryColor}

                            style={{
                                alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28,
                                backgroundColor: type === selected ? primaryColor : primaryBackgroundColor,
                            }}
                        >
                            <TextTheme
                                isPrimary={type === selected}
                                useInvertTheme={type === selected}
                            >{type}</TextTheme>
                        </AnimateButton>
                    ))
                }
            </ScrollView>
        </View>
    );
}



export function InvoiceListing() {
    return (
        <ScrollView contentContainerStyle={{gap: 12}} >
            <BillCard
                billNo="100"
                createOn="10-04-2025"
                customerName="costomer name"
                payAmount={1000}
                pendingAmount={20}
                totalAmount={1200}
                type="Purchase"
            />

            <BillCard
            billNo="100"
            createOn="10-04-2025"
                customerName="costomer name"
                payAmount={1000}
                pendingAmount={0}
                totalAmount={1000}
                type="Sales"
            />
            
            <BillCard
                billNo="100"
                createOn="10-04-2025"
                customerName="costomer name"
                payAmount={1000}
                pendingAmount={20}
                totalAmount={1200}
                type="Sales"
            />
            
            <BillCard
                billNo="100"
                createOn="10-04-2025"
                customerName="costomer name"
                payAmount={1000}
                pendingAmount={0}
                totalAmount={1000}
                type="Purchase"
            />
            
            <BillCard
                billNo="100"
                createOn="10-04-2025"
                customerName="costomer name"
                payAmount={1000}
                pendingAmount={20}
                totalAmount={1200}
                type="Sales"
            />
            
            <BillCard
                billNo="100"
                createOn="10-04-2025"
                customerName="costomer name"
                payAmount={1000}
                pendingAmount={0}
                totalAmount={1000}
                type="Purchase"
            />
        </ScrollView>
    )
}