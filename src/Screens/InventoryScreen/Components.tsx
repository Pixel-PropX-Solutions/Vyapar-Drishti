import { FlatList, ScrollView, View } from "react-native";
import EntityListingHeader from "../../Components/Layouts/Header/EntityListingHeader";
import AnimateButton from "../../Components/Ui/Button/AnimateButton";
import { useTheme } from "../../Contexts/ThemeProvider";
import TextTheme from "../../Components/Ui/Text/TextTheme";
import { useCallback, useState } from "react";
import FeatherIcon from "../../Components/Icon/FeatherIcon";
import BackgroundThemeView from "../../Components/Layouts/View/BackgroundThemeView";
import ScaleAnimationView from "../../Components/Layouts/View/ScaleAnimationView";
import { useFocusEffect } from "@react-navigation/native";

export function Header() {
    return (
        <EntityListingHeader
            title="Inventory"
            paddingBlock={0}
            onPressSearch={() => {}}
            onPressNotification={() => {}}
        />
    )
}


export function ItemStatusFilter(): React.JSX.Element {

    const { primaryColor, primaryBackgroundColor } = useTheme();

    const [selected, setSelected] = useState('All')

    return (
        <View style={{gap: 4, width: '100%'}} >
            <ScrollView 
                horizontal={true}
                contentContainerStyle={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
                {
                    ['All', 'Zero Stoke', 'Low Stoke', 'Well Stoke'].map(type => (
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
                                style={{ fontSize: 12, fontWeight: 900 }}
                            >{type}</TextTheme>
                        </AnimateButton>
                    ))
                }
            </ScrollView>
        </View>
    );
}


export function ItemSortFilter(): React.JSX.Element {

    const { primaryColor, secondaryBackgroundColor } = useTheme();

    const [selected, setSelected] = useState('date')
    const [useAscOrder, setUseAscOrder] = useState(false);

    return (
        <View style={{gap: 4, width: '100%'}} >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} >
                <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 900, paddingLeft: 4}} >Sort by</TextTheme>

                <AnimateButton
                    style={{ height: 28, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 40, paddingInline: 14 }}
                    onPress={() => {  }}
                >
                    <FeatherIcon
                        name={useAscOrder ? 'arrow-up' : 'arrow-down'}
                        size={16}
                    />
                    <TextTheme style={{ fontSize: 12 }} >{useAscOrder ? 'Asc' : 'Des'}</TextTheme>
                </AnimateButton>
            </View>

            <ScrollView 
                horizontal={true}
                contentContainerStyle={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
                {
                    ['date', 'stoke', 'sales', 'purchase'].map(type => (
                        <AnimateButton key={type}
                            onPress={() => { setSelected(type) }}
                            bubbleColor={type === selected ? secondaryBackgroundColor : primaryColor}

                            style={{
                                alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28,
                                backgroundColor: type === selected ? primaryColor : secondaryBackgroundColor,
                            }}
                        >
                            <TextTheme
                                isPrimary={type === selected}
                                useInvertTheme={type === selected}
                                style={{ fontSize: 12, fontWeight: 900 }}
                            >{type}</TextTheme>
                        </AnimateButton>
                    ))
                }
            </ScrollView>
        </View>
    );
}


export function SummarySection() {

    const [GREEN, ORANGE, RED, YELLOW, BLUE] = ['50,200,150', '200,150,50', '250,50,50', '200,150,50', '50,150,200']

    const Card = ({rgb, label, value}: {rgb: string, label: string, value: string}): React.JSX.Element => (
        <View style={{backgroundColor: `rgba(${rgb},0.1)`, flex: 1, borderRadius: 12, position: 'relative', overflow: 'hidden'}} >
            <View style={{width: '100%', position: 'absolute', bottom: 0, left: 0, height: 4, backgroundColor: `rgb(${rgb})`}} />
            <View style={{padding: 12, width: '100%'}} >
                <TextTheme style={{fontSize: 14, fontWeight: 900}} >{value}</TextTheme>
                <TextTheme isPrimary={false} style={{fontSize: 12}} >{label}</TextTheme>
            </View>
        </View>
    )

    return (
        <View style={{width: '100%', gap: 8}} >
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%'}} >
                <Card rgb={RED} label="Zero Stoke" value="1 Items" />
                <Card rgb={YELLOW} label="Low Stoke" value="10 Items" />
                <Card rgb={BLUE} label="Well Stoke" value="100 Items" />
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%'}} >
                <Card rgb={GREEN} label="Sales Value" value="10,000.00 INR" />
                <Card rgb={ORANGE} label="Purchase Value" value="1,000.00 INR" />
            </View>
        </View>
    )
}



export function ItemsListingSection():React.JSX.Element {

    function handleProductFetching() {
        // if (isProductsFetching) { return; }
        // if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
    }

    useFocusEffect(
        useCallback(() => {
            // fetch data...
        }, [])
    );

    return (
        <FlatList
            data={[1,2,3,4,5,6,7,8,9]}
            keyExtractor={item => item.toString()}
            
            style={{flex: 1, width: '100%'}}

            ListHeaderComponent={
                <View style={{marginBottom: 12}} >
                    <SummarySection/>
                </View>
            }

            contentContainerStyle={{gap: 12}}
            renderItem={item => (
                <ScaleAnimationView useRandomDelay={true} >
                    <BackgroundThemeView style={{borderRadius: 12, padding: 12, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} >
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}} >
                            <BackgroundThemeView isPrimary={false} style={{alignItems: 'center', justifyContent: 'center', width: 40, aspectRatio: 1, borderRadius: 8}} >
                                <TextTheme>PN</TextTheme>
                            </BackgroundThemeView>

                            <View>
                                <TextTheme>Product Name</TextTheme>
                                <View style={{flexDirection: 'row', gap: 14}} >
                                    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                                        <FeatherIcon color="rgb(50,200,150)" name="trending-up" size={10} />
                                        <TextTheme color="rgb(50,200,150)" style={{fontSize: 10, fontWeight: 900}} >100</TextTheme>
                                    </View>
                                    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                                        <FeatherIcon color="rgb(200,50,50)" name="trending-down" size={10} />
                                        <TextTheme color="rgb(200,50,50)" style={{fontSize: 10, fontWeight: 900}} >100</TextTheme>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <BackgroundThemeView isPrimary={false} style={{position: 'absolute', top: -2, right: 10, paddingInline: 8, borderRadius: 8, paddingBottom: 2}} >
                            <TextTheme style={{fontSize: 12}} >10 Qta</TextTheme>
                        </BackgroundThemeView>

                        <View style={{alignItems: 'flex-end', alignSelf: 'flex-end'}} >
                            <TextTheme style={{fontSize: 8}} isPrimary={false} >Avg Profit</TextTheme>
                            <TextTheme style={{fontSize: 12}} >100 INR</TextTheme>
                        </View>
                    </BackgroundThemeView>
                </ScaleAnimationView>
            )}


            onScroll={({ nativeEvent }) => {
                let { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                let contentOffsetY = contentOffset.y;
                let totalHeight = contentSize.height;
                let height = layoutMeasurement.height;

                // if (pageMeta.total === productsData?.length) { return; }

                if (totalHeight - height < contentOffsetY + 400) {
                    handleProductFetching();
                }
            }}

        />
    )
}