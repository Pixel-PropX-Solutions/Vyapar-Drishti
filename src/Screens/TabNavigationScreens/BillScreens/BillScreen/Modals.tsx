/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useBillContext } from './Context';
import { ItemSelectorModal } from '../../../../Components/Modal/Selectors/ItemSelectorModal';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { getMonthByIndex } from '../../../../Utils/functionTools';
import BottomModal from '../../../../Components/Modal/BottomModal';
import { View } from 'react-native';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import navigator from '../../../../Navigation/NavigationService';
import SectionView from '../../../../Components/Layouts/View/SectionView';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function DateSelectorModal({ visible, setVisible }: Props): React.JSX.Element {

    const { date, setDate } = useBillContext();

    type Date = { year: number, month: number }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const years: number[] = Array.from({ length: 20 }, (_, i) => currentYear - i);

    const data: Date[] = useMemo(() => {
        let data: Date[] = [];
        for (let year of years) {
            for (let month = 11; month >= 0; month--) {
                if (currentMonth >= month || currentYear > year) { data.push({ year, month }); }
            }
        }
        return data;
    }, []);

    return (
        <ItemSelectorModal<Date>
            allItems={data}
            title="Select Year"
            isItemSelected={!!date.year}
            visible={visible} setVisible={setVisible}
            onSelect={item => { setDate(item); }}
            keyExtractor={item => (item.year * 100 + item.month).toString()}
            SelectedItemContent={
                <TextTheme fontWeight={900}>{getMonthByIndex(date.month)} {date.year}</TextTheme>
            }

            renderItemContent={item => (<>
                <TextTheme isPrimary={item.year === date.year && item.month == date.month} fontSize={20} fontWeight={900}>
                    {getMonthByIndex(item.month)}
                </TextTheme>
                <TextTheme isPrimary={item.year === date.year && item.month == date.month} fontSize={20} fontWeight={900}>
                    {item.year}
                </TextTheme>
            </>)}

            filter={(item, val) => (
                item.year.toString().startsWith(val) ||
                item.year.toString().endsWith(val) ||
                getMonthByIndex(date.month).toLowerCase().startsWith(val)
            )}
        />
    );
}


const dummyBillsType: { name: string; icon: string; color: string; description: string, id: string }[] = [
    { name: 'Sales', icon: 'trending-up', color: '#4CAF50', description: 'Record sales transactions', id: '34e81b1d-5735-437a-a475-e27265eba005' },
    { name: 'Purchase', icon: 'shopping-cart', color: '#2196F3', description: 'Track purchase expenses', id: 'fe9221db-5990-41a0-976a-3cb4f78aef0f' },
];

export function BillTypeSelectorModal({ visible, setVisible }: Props) {

    const { primaryColor } = useTheme();

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
            backdropColor="rgba(0, 0, 0, 0.5)"
            animationType="slide"
            style={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    marginBottom: 16,
                }} />
                <TextTheme fontSize={24} fontWeight={"bold"}>
                    Create New Bill
                </TextTheme>
                <TextTheme fontSize={14} style={{ opacity: 0.7, marginTop: 4 }}>
                    Select the type of bill you want to create
                </TextTheme>
            </View>

            <View style={{ gap: 10 }}>
                {dummyBillsType.map((billType) => (
                    <AnimateButton
                        key={billType.name}
                        style={{
                            borderRadius: 16,
                            padding: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 16,
                            borderWidth: 1,
                            borderColor: primaryColor,
                        }}
                        onPress={() => {
                            navigator.navigate('create-bill-screen', { type: billType.name, id: billType.id });
                            setVisible(false);
                        }}
                    >
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: billType.color,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <FeatherIcon name={billType.icon} size={24} color="#FFFFFF" />
                        </View>

                        <View style={{ flex: 1 }}>
                            <TextTheme fontSize={16} fontWeight={"bold"}>
                                {billType.name}
                            </TextTheme>
                            <TextTheme fontSize={12} style={{ opacity: 0.7, marginTop: 2 }}>
                                {billType.description}
                            </TextTheme>
                        </View>

                        <FeatherIcon name="chevron-right" size={20} />
                    </AnimateButton>
                ))}
            </View>
        </BottomModal>
    );
}



export function FilterModal({ visible, setVisible }: Props) {

    const { primaryColor, primaryBackgroundColor } = useTheme();
    const { filters, handleFilter } = useBillContext();

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{ paddingInline: 20, gap: 24 }}
        >
            <TextTheme fontSize={20} fontWeight={900}>Bills Filters</TextTheme>
            <SectionView label="Type" style={{ flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap' }} >
                {
                    ['Invoices', 'Sales', 'Purchase', 'Transactions', 'Payment', 'Receipt'].map(item => (
                        <AnimateButton key={item}
                            onPress={() => {
                                handleFilter('billType', item as 'Invoices' | 'Sales' | 'Purchase' | 'Transactions' | 'Payment' | 'Receipt');
                                setVisible(false);
                            }}
                            bubbleColor={item === filters.billType ? primaryBackgroundColor : primaryColor}

                            style={{
                                alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 32,
                                backgroundColor: item === filters.billType ? primaryColor : primaryBackgroundColor,
                            }}
                        >
                            <TextTheme
                                isPrimary={item === filters.billType}
                                useInvertTheme={item === filters.billType}
                                fontSize={12}
                                fontWeight={900}
                            >{item}</TextTheme>
                        </AnimateButton>
                    ))
                }
            </SectionView>

            {/* <SectionView label="Sort by" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }} >
                {
                    ['Default', 'Date', 'Amount', 'Type'].map(item => (
                        <AnimateButton key={item}
                            onPress={() => handleFilter('sortBy', item)}
                            bubbleColor={item === filters.sortBy ? primaryBackgroundColor : primaryColor}

                            style={{
                                alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 32,
                                backgroundColor: item === filters.sortBy ? primaryColor : primaryBackgroundColor,
                            }}
                        >
                            <TextTheme
                                isPrimary={item === filters.sortBy}
                                useInvertTheme={item === filters.sortBy}
                                fontSize={12}
                                fontWeight={900}
                            >{item}</TextTheme>
                        </AnimateButton>
                    ))
                }
            </SectionView>

            <SectionView label="Status" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }} >
                {
                    ['All', 'Pending', 'Paid'].map(item => (
                        <AnimateButton key={item}
                            onPress={() => handleFilter('status', item.toLowerCase() as 'all' | 'pending' | 'paid')}
                            bubbleColor={item.toLowerCase() === filters.status ? primaryBackgroundColor : primaryColor}

                            style={{
                                alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 32,
                                backgroundColor: item.toLowerCase() === filters.status ? primaryColor : primaryBackgroundColor,
                            }}
                        >
                            <TextTheme
                                isPrimary={item.toLowerCase() === filters.status}
                                useInvertTheme={item.toLowerCase() === filters.status}
                                fontSize={12}
                                fontWeight={900}
                            >{item}</TextTheme>
                        </AnimateButton>
                    ))
                }
            </SectionView> */}
        </BottomModal>
    );
}
