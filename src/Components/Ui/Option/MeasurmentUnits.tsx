/* eslint-disable react-native/no-inline-styles */
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import AnimateButton from '../Button/AnimateButton';
import { MeasurmentUnitsData, MeasurmentUnitType } from '../../../Assets/objects-data/measurment-units-data';
import { View, ViewStyle } from 'react-native';
import ShowWhen from '../../Other/ShowWhen';
import FeatherIcon from '../../Icon/FeatherIcon';
import TextTheme from '../Text/TextTheme';
import { useTheme } from '../../../Contexts/ThemeProvider';
import { ItemSelectorModal } from '../../Modal/Selectors/ItemSelectorModal';

type Props = {
    style?: ViewStyle
    label?: string,
    onSelect?: (unitInfo: MeasurmentUnitType) => void,
    reanderCustomButton?: (item: MeasurmentUnitType) => ReactNode
    error?: string
}

export default function MeasurementUnitsOpation({ onSelect, label, style, reanderCustomButton, error }: Props): React.JSX.Element {

    const { primaryColor } = useTheme();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [selected, setSelected] = useState<MeasurmentUnitType>(undefined);

    useEffect(() => {
        if (selected?.id && onSelect) { onSelect(selected); }
    }, [selected]);

    return (
        <AnimateButton
            onPress={() => { setModalVisible(true); }}
            style={
                reanderCustomButton ? style : {
                    borderWidth: 1, borderRadius: 12, paddingInline: 12, flexDirection: 'row', alignItems: 'center', gap: 16, borderColor: error ? 'red' : primaryColor, paddingBlock: 12, ...style,
                }
            }
        >
            <ShowWhen when={!reanderCustomButton} otherwise={reanderCustomButton ? reanderCustomButton(selected) : null} >
                <FeatherIcon name="layers" size={20} />
                <TextTheme fontSize={14} style={{ flex: 1 }}>{selected?.value ?? label ?? 'Select Unit'}</TextTheme>
                <FeatherIcon name="chevron-right" size={20} />
            </ShowWhen>

            <UnitModal visible={isModalVisible} setVisible={setModalVisible} selected={selected} setSelected={setSelected} />
        </AnimateButton>
    );
}


type UnitModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
    selected: MeasurmentUnitType,
    setSelected: Dispatch<SetStateAction<MeasurmentUnitType>>
}

function UnitModal({ visible, setVisible, selected, setSelected }: UnitModalProps): React.JSX.Element {
    return (
        <ItemSelectorModal<MeasurmentUnitType>
            visible={visible} setVisible={setVisible}
            allItems={MeasurmentUnitsData}
            keyExtractor={(item, index) => item?.id ?? index.toString()}

            isItemSelected={!!selected?.id}
            SelectedItemContent={<View>
                <TextTheme fontWeight={900} fontSize={14}>{selected?.unit_name}</TextTheme>
                <TextTheme isPrimary={false} fontWeight={900} fontSize={14}>{selected?.symbol}</TextTheme>
            </View>}

            renderItemStyle={{ justifyContent: 'space-between' }}
            renderItemContent={item => (<>
                <TextTheme fontWeight={900} fontSize={14}>{item?.unit_name}</TextTheme>
                <TextTheme isPrimary={false} fontWeight={900} fontSize={14}>{item?.symbol}</TextTheme>
            </>)}

            filter={(item, val) => !!(
                item?.symbol.toLowerCase().startsWith(val) ||
                item?.unit_name.toLowerCase().startsWith(val)
            )}

            onSelect={setSelected}
            title="Selec Unit"
        />
    );
}
