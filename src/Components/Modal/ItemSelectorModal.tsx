import { FlatList, View, ViewStyle } from "react-native";
import TextTheme from "../Text/TextTheme";
import { SectionRow } from "../View/SectionView";
import NoralTextInput from "../TextInput/NoralTextInput";
import FeatherIcon from "../Icon/FeatherIcon";
import ShowWhen from "../Other/ShowWhen";
import BottomModal, { BottomModalActionButton } from "./BottomModal";
import { useTheme } from "../../Contexts/ThemeProvider";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";

type Props<item> = {
    title: string
    allItems: item[],
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    onSelect: (item: item) => void,
    SelectedItemContent: ReactNode,
    renderItemContent: (item: item) => ReactNode
    keyExtractor: (item: item) => string,
    filter: (item: item, val: string) => boolean,
    actionButtons?: BottomModalActionButton[]
    isItemSelected?: boolean,
    closeOnSelect?: boolean
    renderItemStyle?: ViewStyle,
}

export function ItemSelectorModal<item>({ visible, setVisible, onSelect, allItems, title, keyExtractor, filter, SelectedItemContent, renderItemContent, actionButtons, isItemSelected=false, renderItemStyle, closeOnSelect = true }: Props<item>): React.JSX.Element {

    const { primaryColor } = useTheme();

    const [data, setData] = useState<item[]>(allItems);
    const timeoutId = useRef<NodeJS.Timeout>(undefined);

    function handleDataFilter(inputValue: string): void {
        inputValue = inputValue.trim().toLowerCase();
        clearTimeout(timeoutId.current);
        if (!inputValue) {
            setData(allItems);
            return;
        }

        timeoutId.current = setTimeout(() => {
            setData(allItems.filter(item => filter(item, inputValue)));
        }, 250);
    }

    useEffect(() => {
        setData(allItems);
    }, [allItems]);

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{ paddingInline: 20, gap: 20 }}
            actionButtons={actionButtons}
            topMargin={0}
        >
            <TextTheme style={{ fontSize: 20, fontWeight: 900 }} >
                {title}
            </TextTheme>

            <ShowWhen when={isItemSelected !== null} >
                <View style={{ width: "100%", padding: 16, borderRadius: 16, backgroundColor: 'rgba(150, 50, 250, 1)', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }} >
                    {SelectedItemContent}

                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                        <FeatherIcon name="check" size={20} color="white" />
                        <TextTheme color="white" style={{ fontWeight: 900 }} >Selected</TextTheme>
                    </View>
                </View>
            </ShowWhen>

            <View
                style={{ borderWidth: 2, borderColor: primaryColor, borderRadius: 100, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 10, paddingRight: 16, gap: 8 }}
            >
                <FeatherIcon name="search" size={20} />

                <NoralTextInput
                    placeholder="Search"
                    style={{ flex: 1 }}
                    onChangeText={handleDataFilter}
                />
            </View>

            <FlatList
                keyboardShouldPersistTaps='always'
                contentContainerStyle={{ gap: 10 }}
                data={data}

                keyExtractor={item => (
                    keyExtractor(item)
                )}

                renderItem={({ item }) => (
                    <SectionRow
                        style={{ justifyContent: 'space-between', ...renderItemStyle }}
                        onPress={() => {
                            if (closeOnSelect)
                                setVisible(false)

                            setData(allItems)
                            if (onSelect) onSelect(item)
                        }}
                    >
                        {renderItemContent(item)}
                    </SectionRow>
                )}
            />

        </BottomModal>
    )
}