import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTimelineContext } from './Context';
import { ItemSelectorModal } from '../../Components/Modal/Selectors/ItemSelectorModal';
import TextTheme from '../../Components/Ui/Text/TextTheme';
import { getMonthByIndex } from '../../Utils/functionTools';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function DateSelectorModal({ visible, setVisible }: Props): React.JSX.Element {

    const { date, setDate, handleFilter } = useTimelineContext();

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
            onSelect={item => {
                setDate(item);
                handleFilter('startDate', new Date(item.year, item.month, 1).toISOString());
                handleFilter('endDate', new Date(item.year, item.month + 1, 0).toISOString());
            }}
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
