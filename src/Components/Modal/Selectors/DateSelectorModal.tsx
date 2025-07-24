import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Modal, ModalProps, Pressable, View } from "react-native";
import BackgroundThemeView from "../../Layouts/View/BackgroundThemeView";
import TextTheme from "../../Ui/Text/TextTheme";
import AnimateButton from "../../Ui/Button/AnimateButton";
import NormalButton from "../../Ui/Button/NormalButton";
import FeatherIcon from "../../Icon/FeatherIcon";
import { useTheme } from "../../../Contexts/ThemeProvider";
import { ItemSelectorModal } from "./ItemSelectorModal";

type Props = ModalProps & {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    closeOnBack?: boolean
    onClose?: () => void,
    onSelect: (ddmmyy: {year: number, month: number, date: number}) => void,
    value?: {year: number, month: number, date: number}
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function DateSelectorModal({visible, setVisible, onClose, closeOnBack=true, onSelect, value, ...props}: Props): React.JSX.Element {
    
    const {primaryColor} = useTheme();

    const [date, setDate] = useState(value?.date ?? new Date().getDate());
    const [month, setMonth] = useState(value?.month ?? new Date().getMonth());
    const [year, setYear] = useState(value?.year ?? new Date().getFullYear());

    const [isYearModalVisible, setYearModalVisible] = useState<boolean>(false);

    function incrementMonth(by: number) {
        const nextMonth = (month + by + 12) % 12;
        setMonth(nextMonth);

        if(0 <= month + by && month + by <= 11) return;

        const nextYear = year + Math.floor((month + by) / 12);
        setYear(nextYear)
    }

    useEffect(() => {
        if(visible) return;

        setDate(value?.date ?? new Date().getDate());
        setMonth(value?.month ?? new Date().getMonth());
        setYear(value?.year ?? new Date().getFullYear());

    }, [visible])
   
    return (
        <Modal
            {...props}
            visible={visible} 
            onRequestClose={() => {setVisible(closeOnBack); if(onClose) onClose();}}
            animationType="fade"
            backdropColor={'rgba(0,0,0,0.5)'}
        >
            <View style={{width: '100%', height: '100%', padding: 20, alignItems: 'center', justifyContent: 'center'}} >
                <AnimateButton style={{flex: 1, width: '100%'}} onPress={() => {setVisible(!closeOnBack)}} />

                <BackgroundThemeView isPrimary={false} style={{padding: 12, borderRadius: 10, width: '100%', gap: 12}} >

                    <TextTheme>Select Date</TextTheme>

                    <TextTheme style={{fontSize: 28, fontWeight: 900}} >
                        {monthNames[month]} {date}, {year}
                    </TextTheme>

                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingInline: 10, height: 40, borderRadius: 40, borderWidth: 2, borderColor: primaryColor}} >
                        <AnimateButton style={{borderRadius: 20, padding: 4}} onPress={() => {incrementMonth(-1)}}>
                            <FeatherIcon name="chevron-left" size={20} />
                        </AnimateButton>
            
                        <Pressable onPress={() => {setYearModalVisible(true)}} >
                            <TextTheme style={{fontSize: 16, fontWeight: 900}} >{monthNames[month]}, {year}</TextTheme>
                        </Pressable>
                        
                        <AnimateButton style={{borderRadius: 20, padding: 4}} onPress={() => {incrementMonth(1)}}>
                            <FeatherIcon name="chevron-right" size={20} />
                        </AnimateButton>
                    </View>

                    <DisplayCalender date={date} month={month} year={year} onSelect={(date) => setDate(date)} />

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 12}} >
                        <NormalButton 
                            isPrimary={false} text="Cancel" 
                            textStyle={{fontWeight: 900, fontSize: 14}} 
                            onPress={() => {setVisible(false)}}
                        />
                        <NormalButton 
                            text="Select" textStyle={{fontWeight: 900, fontSize: 14}} 
                            onPress={() => {
                                onSelect({year, month, date}); setVisible(false)
                            }}    
                        />
                    </View>
                </BackgroundThemeView>

                <AnimateButton style={{flex: 1, width: '100%'}} onPress={() => {setVisible(!closeOnBack)}} />
            </View>

            <YearSelectorModal
                visible={isYearModalVisible} setVisible={setYearModalVisible}
                setYear={setYear} year={year} 
                month={month} setMonth={setMonth}
                date={date}
            />
        </Modal>
    )
}


type DisplayCalenderProps = {
    date: number, month: number, year: number,
    onSelect?: (date: number) => void
}

function DisplayCalender({date, month, year, onSelect}: DisplayCalenderProps): React.JSX.Element {

    const calenderMat = useMemo(() => {
        const calendar: number[][] = [];

        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate(); 

        let currentDay = 1;
        let week: number[] = [];

        for (let i = 0; i < 7; i++) week.push(i < firstDay ? 0 : currentDay++);
        calendar.push(week);

        while (currentDay <= totalDays) {
            week = [];
            for (let i = 0; i < 7; i++) week.push(currentDay <= totalDays ? currentDay++ : 0);
            calendar.push(week);
        }

        return calendar;
    }, [year, month]);

    const currentDate = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const [selected, setSelected] = useState<number>(date ?? currentDate);

    function handleSelect(date: number) {
        if(date !== 0) {
            setSelected(date);

            if(onSelect) onSelect(date);
        }
    }
    
    return (
        <View style={{alignItems: 'center', justifyContent: 'center', gap: 4}} >
            <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                {
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <View key={day} style={{aspectRatio: 1, width: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}  >
                            <TextTheme isPrimary={false} style={{fontWeight: 900, fontSize: 14}} >{day}</TextTheme>
                        </View>
                    ))
                }
            </View>

            {
                calenderMat.map((week, y) => (
                    <View key={`week-${y}`} style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                        {
                            week.map((date, x) => (
                                 <BackgroundThemeView 
                                    key={`day-${y}-${x}`} 
                                    isPrimary={currentDate === date && currentMonth === month && currentYear === year}
                                    backgroundColor={date === selected ? 'rgb(50,100,200)' : ''}
                                    style={{ borderRadius: 8, overflow: 'hidden'}}  
                                >
                                    <AnimateButton 
                                        bubbleScale={3}
                                        onPress={() => handleSelect(date)}
                                        style={{alignItems: 'center', justifyContent: 'center', aspectRatio: 1, width: 40}}
                                    >
                                        <TextTheme 
                                            color={date === selected ? 'white' : ''}
                                            style={{fontWeight: 900, fontSize: 14}} 
                                        >
                                            {date === 0 ? null : date}
                                        </TextTheme>
                                    </AnimateButton>
                                </BackgroundThemeView>
                            ))
                        }
                    </View>
                ))
            }
        </View>
    )
}

type Year = {year: number, month: number}

type YearSelectorModalProps = {
    visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>,
    year: number, setYear: Dispatch<SetStateAction<number>>,
    month: number, setMonth: Dispatch<SetStateAction<number>>,
    date: number
}

function YearSelectorModal({visible, setVisible, year, setYear, month, setMonth, date}: YearSelectorModalProps): React.JSX.Element {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const years: number[] = Array.from({length: 20}, (_, i) => currentYear - i);

    const data: Year[] =  useMemo(() => {
        let data: Year[] = [];
        for(let year of years) {
            for(let month=11; month>=0; month--) {
                if(currentMonth >= month || currentYear > year)
                    data.push({year, month})
            }
        }
        return data;
    }, [])

    return (
        <ItemSelectorModal
            allItems={data}
            isItemSelected={!!year}
            visible={visible} setVisible={setVisible}
            onSelect={item => {setYear(item.year); setMonth(item.month)}}
            keyExtractor={item => (item.year * 100 + item.month).toString()}
            SelectedItemContent={
                <TextTheme style={{fontWeight: 900}} >{monthNames[month]} {date}, {year}</TextTheme>
            }

            renderItemContent={item => (<>
                <TextTheme isPrimary={item.year === year && item.month == month} style={{fontSize: 20, fontWeight: 900}} >
                    {monthNames[item.month]} {date}
                </TextTheme>
                <TextTheme isPrimary={item.year === year && item.month == month} style={{fontSize: 20, fontWeight: 900}} >
                    {item.year}
                </TextTheme>
            </>)}

            filter={(item, val) => (
                item.year.toString().startsWith(val) || 
                item.year.toString().endsWith(val) || 
                monthNames[item.month].toLowerCase().startsWith(val)
            )}
            title="Select Year"
        />
    )
}