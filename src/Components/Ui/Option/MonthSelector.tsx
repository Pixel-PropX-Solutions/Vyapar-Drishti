/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../Contexts/ThemeProvider';
import { Pressable, View } from 'react-native';
import AnimateButton from '../Button/AnimateButton';
import FeatherIcon from '../../Icon/FeatherIcon';
import TextTheme from '../Text/TextTheme';
import { getMonthByIndex } from '../../../Utils/functionTools';
import { ItemSelectorModal } from '../../Modal/Selectors/ItemSelectorModal';


type Date = { month: number, year: number }
type Props = {
    onSelect?: (date: Date) => void,
    value?: Date
}

export default function MonthSelector({ value, onSelect }: Props) {

    const { primaryColor } = useTheme();

    const time = useMemo(() => new Date(), []);

    const [date, setDate] = useState<Date>(value ?? { month: time.getMonth(), year: time.getFullYear() });
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    function incrementMonth(by: number) {
        const nextMonth = (date.month + by + 12) % 12;
        const nextYear = date.year + Math.floor((date.month + by) / 12);
        setDate({ year: nextYear, month: nextMonth });
        if (onSelect) { onSelect({ year: nextYear, month: nextMonth }); }
    }

    useEffect(() => {
        if (value) { setDate(value); }

    }, [value]);

    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingInline: 10, height: 40, borderRadius: 40, borderWidth: 2, borderColor: primaryColor }} >
            <AnimateButton style={{ borderRadius: 20, padding: 4 }} onPress={() => incrementMonth(-1)}>
                <FeatherIcon name="chevron-left" size={20} />
            </AnimateButton>

            <Pressable onPress={() => { setModalVisible(true); }}>
                <TextTheme fontSize={16} fontWeight={900}>{getMonthByIndex(date.month)}, {date.year}</TextTheme>
            </Pressable>

            <AnimateButton style={{ borderRadius: 20, padding: 4 }} onPress={() => incrementMonth(1)}>
                <FeatherIcon name="chevron-right" size={20} />
            </AnimateButton>

            <DateSelectorModal
                date={date}
                setDate={(newDate: Date) => {
                    setDate(newDate);
                    if (onSelect) { onSelect(newDate); }
                }}
                visible={isModalVisible}
                setVisible={setModalVisible}
            />
        </View>
    );
}


type ModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    date: Date, setDate: (date: Date) => void,
}

function DateSelectorModal({ visible, setVisible, date, setDate }: ModalProps): React.JSX.Element {

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
                <TextTheme isPrimary={item.year === date.year && item.month === date.month} fontSize={20} fontWeight={900}>
                    {getMonthByIndex(item.month)}
                </TextTheme>
                <TextTheme isPrimary={item.year === date.year && item.month === date.month} fontSize={20} fontWeight={900}>
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
