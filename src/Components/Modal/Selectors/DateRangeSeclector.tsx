import { Pressable, ScrollView, View } from "react-native";
import AnimateButton from "../../Ui/Button/AnimateButton";
import FeatherIcon from "../../Icon/FeatherIcon";
import TextTheme from "../../Ui/Text/TextTheme";
import { useTheme } from "../../../Contexts/ThemeProvider";
import BottomModal from "../BottomModal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SectionView from "../../Layouts/View/SectionView";
import RoundedButton from "../../Ui/Button/RoundedButton";
import { getMonthByIndex } from "../../../Utils/functionTools";
import DateSelectorModal from "./DateSelectorModal";
import ShowWhen from "../../Other/ShowWhen";
import { fullMonthNames } from "../../../Utils/DateAndTime";


type DateObj = {year: number, month: number, date: number};
type Range = {from?: DateObj, to?: DateObj};

type Filter = {
    month: number,
    range: Range
}

type ActiveFilter = keyof Filter;

type HandleFilter = <Name extends keyof Filter>(name: Name, val: Filter[Name]) => void;

type Props = {
    defaultValue?: Filter,
    onSelect: HandleFilter
}

export default function DateRangeSelector({ onSelect, defaultValue }: Props): React.JSX.Element {

    const time = new Date();
    const { primaryColor } = useTheme();


    const [filter, setFilter] = useState<Filter>(defaultValue ?? {month: time.getMonth(), range: {}});
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>('month');

    const [isModalVisible, setModalVisible] = useState(true);


    const handleFilter: HandleFilter = (name, val) => {
        setFilter(pre => ({
            ...pre, [name]: val        
        }));
    }
  
    function handleChangeMonthBy(by: number) {
        const mm = filter.month + by;
        if(mm < 0) return handleFilter('month', 11);
        if(mm > 11) return handleFilter('month', 0);
        handleFilter('month', mm);
    }


    useEffect(() => {
        if(defaultValue)
            setFilter(defaultValue);
    }, [filter]);


    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: activeFilter === 'month' ? 'space-between' : 'center', alignItems: 'center', width: "100%", paddingInline: 10, height: 40, borderRadius: 40, borderWidth: 2, borderColor: primaryColor }} >
            <ShowWhen when={activeFilter === 'month'} >
                <AnimateButton style={{ borderRadius: 20, padding: 4 }} onPress={_ => handleChangeMonthBy(-1)}>
                    <FeatherIcon name="chevron-left" size={20} />
                </AnimateButton>
            </ShowWhen>

            <Pressable onPress={_ => setModalVisible(true)} >
                <TextTheme fontSize={16} fontWeight={900}>
                    <ShowWhen when={activeFilter === 'month'} >
                        {getMonthByIndex(filter.month)}, {time.getFullYear()}
                    </ShowWhen>

                    <ShowWhen when={activeFilter === 'range'} >
                        <ShowWhen when={!!filter.range.from?.month} otherwise={'starting'} >
                            {filter.range.from?.date} {filter.range.from?.month && getMonthByIndex(filter.range.from?.month)} {filter.range.from?.year}
                        </ShowWhen>
                        {' to '}
                        <ShowWhen when={!!filter.range.to?.month} otherwise={'present'} >
                            {filter.range.to?.date} {filter.range.to?.month && getMonthByIndex(filter.range.to.month)} {filter.range.to?.year}
                        </ShowWhen>
                    </ShowWhen>
                </TextTheme>
            </Pressable>

            <ShowWhen when={activeFilter === 'month'} >
                <AnimateButton style={{ borderRadius: 20, padding: 4 }} onPress={_ => handleChangeMonthBy(1)} >
                    <FeatherIcon name="chevron-right" size={20} />
                </AnimateButton>
            </ShowWhen>

            <DateRangeSeclectorModal
                visible={isModalVisible} 
                setVisible={setModalVisible}
                onSelect={onSelect}
                filter={filter} handleFilter={handleFilter}
                activeFilter={activeFilter} setactiveFilter={setActiveFilter}
            />
        </View>
    )
}



type DateRangeSeclectorModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    onSelect: HandleFilter,
    filter: Filter, handleFilter: HandleFilter
    activeFilter: ActiveFilter, setactiveFilter: Dispatch<SetStateAction<ActiveFilter>>
}

function DateRangeSeclectorModal({visible, setVisible, onSelect, filter, handleFilter, activeFilter, setactiveFilter}: DateRangeSeclectorModalProps): React.JSX.Element {
    
    const [isFromModalVisible, setFromModalVisible] = useState(false);
    const [isToModalVisible, setToModalVisible] = useState(false);
    
    function handleOnChange() {
        if(activeFilter === 'month') return onSelect('month', filter.month);
        if(activeFilter === 'range') return onSelect('range', filter.range);
    }

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            actionButtons={[{
                title: 'Set',
                backgroundColor: 'rgb(50,200,150)',
                onPress: handleOnChange
            }]}
        >
            <ScrollView contentContainerStyle={{paddingInline: 20, gap: 20}} >   
                <SectionView label="Choose month">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{gap: 12}}
                    >
                        {
                            fullMonthNames.map((name, index) => (
                                <RoundedButton
                                    key={name}
                                    title={name}
                                    fontSize={14}
                                    
                                    backgroundColor={
                                        activeFilter === 'month' && index === filter.month ? 
                                            "rgb(100,140,255)" : undefined
                                    }

                                    onPress={_ => {
                                        setactiveFilter('month')
                                        handleFilter('month', index)
                                    }}
                                />
                            ))
                        }
                    </ScrollView>
                </SectionView>

                <SectionView  
                    label="or custome range"
                    style={{gap: 12}}
                >
                    <RoundedButton
                        fullWidth={true}
                        backgroundColor="transparent"
                        style={{justifyContent: 'space-between', borderWidth: 2, borderColor: 'rgb(125,125,125)'}}
                        onPress={_ => setFromModalVisible(true)}
                    >
                        <TextTheme fontSize={14} >From</TextTheme>
                        <TextTheme fontSize={14} isPrimary={false}>
                            <ShowWhen when={activeFilter === 'range' && !!filter.range.from?.month} otherwise={'Add date'} >
                                {filter.range.from?.date} {filter.range.from?.month && getMonthByIndex(filter.range.from?.month)} {filter.range.from?.year}
                            </ShowWhen>
                        </TextTheme>
                    </RoundedButton>
                    
                    <RoundedButton
                        fullWidth={true}
                        backgroundColor="transparent"
                        style={{justifyContent: 'space-between', borderWidth: 2, borderColor: 'rgb(125,125,125)'}}
                        onPress={_ => setToModalVisible(true)}
                    >
                        <TextTheme fontSize={14} >To</TextTheme>
                        <TextTheme fontSize={14} isPrimary={false}>
                            <ShowWhen when={activeFilter === 'range' && !!filter.range.to?.month} otherwise={'Add date'} >
                                {filter.range.to?.date} {filter.range.to?.month && getMonthByIndex(filter.range.to?.month)} {filter.range.to?.year}
                            </ShowWhen>
                        </TextTheme>
                    </RoundedButton>
                </SectionView>

                <SectionView label="or all time" >
                    <RoundedButton title="Select All Time" backgroundColor="transparent" style={{borderWidth: 2, borderColor: 'rgb(125,125,125)'}} />
                </SectionView>


                <View style={{minHeight: 40}} />
            </ScrollView>

            <DateSelectorModal
                visible={isFromModalVisible}
                setVisible={setFromModalVisible}
                value={filter.range.from}
                onSelect={from => {
                    setactiveFilter('range')
                    handleFilter('range', {to: filter.range.to, from})
                }}
            />
            
            <DateSelectorModal
                visible={isToModalVisible}
                setVisible={setToModalVisible}
                value={filter.range.to}
                onSelect={to => {
                    setactiveFilter('range')
                    handleFilter('range',{to, from: filter.range.from,})
                }}
            />
        </BottomModal>
    )
}