import { Dispatch, SetStateAction, useMemo } from "react";
import { useProductListingContext } from "./Context";
import { ItemSelectorModal } from "../../../../Components/Modal/ItemSelectorModal";
import TextTheme from "../../../../Components/Text/TextTheme";
import { getMonthByIndex } from "../../../../Utils/functionTools";

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function DateSelectorModal({visible, setVisible}: Props): React.JSX.Element {

    const {date, setDate} = useProductListingContext()

    type Date = {year: number, month: number}

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const years: number[] = Array.from({length: 20}, (_, i) => currentYear - i);

    const data: Date[] =  useMemo(() => {
        let data: Date[] = [];
        for(let year of years) {
            for(let month=11; month>=0; month--) {
                if(currentMonth >= month || currentYear > year)
                    data.push({year, month})
            }
        }
        return data;
    }, [])
   
    return (
        <ItemSelectorModal<Date>
            allItems={data}
            isItemSelected={!!date.year}
            visible={visible} setVisible={setVisible}
            onSelect={item => {setDate(item)}}
            keyExtractor={item => (item.year * 100 + item.month).toString()}
            SelectedItemContent={
                <TextTheme style={{fontWeight: 900}} >{getMonthByIndex(date.month)} {date.year}</TextTheme>
            }

            renderItemContent={item => (<>
                <TextTheme isPrimary={item.year === date.year && item.month == date.month} style={{fontSize: 20, fontWeight: 900}} >
                    {getMonthByIndex(item.month)} 
                </TextTheme>
                <TextTheme isPrimary={item.year === date.year && item.month == date.month} style={{fontSize: 20, fontWeight: 900}} >
                    {item.year}
                </TextTheme>
            </>)}

            filter={(item, val) => (
                item.year.toString().startsWith(val) || 
                item.year.toString().endsWith(val) || 
                getMonthByIndex(date.month).toLowerCase().startsWith(val)
            )}
            title="Select Year"
        />
    )
}