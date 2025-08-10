/* eslint-disable react-native/no-inline-styles */
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import BottomModal from '../../../../Components/Modal/BottomModal';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import SectionView from '../../../../Components/Layouts/View/SectionView';
import { useProductContext } from './Context';
import { SelectField } from '../../../../Components/Ui/TextInput/SelectField';
import { useProductStore } from '../../../../Store/ReduxStore';
import { Dispatch, SetStateAction, useState } from 'react';
import { View } from 'react-native';
import { ItemSelectorModal } from '../../../../Components/Modal/Selectors/ItemSelectorModal';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
const sortValues = [{
    label: 'Default',
    value: 'created_at',
}, {
    label: 'Name',
    value: 'stock_item_name',
}, {
    label: 'Quantity',
    value: 'current_stock',
}, {
    label: 'Unit',
    value: 'unit',
}, {
    label: 'Restock Date',
    value: 'last_restock_date',
}];

export function FilterModal({ visible, setVisible }: Props) {

    const { primaryColor, primaryBackgroundColor } = useTheme();
    const { filters, handleFilter, resetFilters } = useProductContext();
    const { productsPageMeta } = useProductStore();
    const [isCategoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
    const [isGroupModalVisible, setGroupModalVisible] = useState<boolean>(false);


    return (
        <>
            <BottomModal
                visible={visible} setVisible={setVisible}
                style={{ paddingInline: 20 }}
                actionButtons={[
                    {
                        key: 'reset-filters',
                        title: 'Reset Filters',
                        backgroundColor: 'rgb(50,200,150)',
                        onPress: () => { resetFilters(); setVisible(false); },
                    },
                ]}
            >
                <TextTheme fontSize={20} fontWeight={900}>Product Filters</TextTheme>
                <SectionView label="Sort by" style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' }} containerStyle={{ marginTop: 12 }} labelMargin={6} >
                    {
                        sortValues.map(item => (
                            <AnimateButton key={item.value}
                                onPress={() => { handleFilter('sortBy', item.value); setVisible(false); }}
                                bubbleColor={item.value === filters.sortBy ? primaryBackgroundColor : primaryColor}

                                style={{
                                    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 32,
                                    backgroundColor: item.value === filters.sortBy ? primaryColor : primaryBackgroundColor,
                                }}
                            >
                                <TextTheme
                                    isPrimary={item.value === filters.sortBy}
                                    useInvertTheme={item.value === filters.sortBy}
                                    fontSize={12}
                                    fontWeight={900}
                                >{item.label}</TextTheme>
                            </AnimateButton>
                        ))
                    }
                </SectionView>

                <SectionView label="Category" containerStyle={{ marginTop: 12 }} labelMargin={6} >
                    <SelectField
                        icon={<FeatherIcon name="folder" size={20} color={primaryColor} />}
                        placeholder="Select Category"
                        value={productsPageMeta.unique_categories.find(option => option === filters.category) || 'All Categories'}
                        onPress={() => setCategoryModalVisible(true)}
                    />
                </SectionView>

                <SectionView label="Group" labelMargin={6} >
                    <SelectField
                        icon={<FeatherIcon name="grid" size={20} color={primaryColor} />}
                        placeholder="Select Group"
                        value={productsPageMeta.unique_groups.find(option => option === filters.group) || 'All Groups'}
                        onPress={() => setGroupModalVisible(true)}
                    />
                </SectionView>
            </BottomModal>
            <CategoryModal
                visible={isCategoryModalVisible}
                setVisible={setCategoryModalVisible}
                setPrimaryVisible={setVisible}
                selected={{ id: filters.category || '', value: filters.category || '' }}
                setSelected={(val) => {
                    const valueObj = typeof val === 'function' ? val({ id: '', value: '' }) : val;
                    handleFilter('category', valueObj.id || '');
                }}
            />
            <GroupModal
                visible={isGroupModalVisible}
                setVisible={setGroupModalVisible}
                setPrimaryVisible={setVisible}
                selected={{ id: filters.group || '', value: filters.group || '' }}
                setSelected={(val) => {
                    const valueObj = typeof val === 'function' ? val({ id: '', value: '' }) : val;
                    handleFilter('group', valueObj.id || '');
                }}
            />
        </>
    );
}



type CategoryModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    setPrimaryVisible: Dispatch<SetStateAction<boolean>>,
    selected: { id: string, value: string },
    setSelected: Dispatch<SetStateAction<{ id: string, value: string }>>
}

function CategoryModal({ visible, setVisible, selected, setSelected, setPrimaryVisible }: CategoryModalProps): React.JSX.Element {
    const { productsPageMeta } = useProductStore();
    return (
        <ItemSelectorModal<{ id: string, value: string }>
            visible={visible} setVisible={() => { setVisible(false); setPrimaryVisible(false); }}
            allItems={productsPageMeta.unique_categories.map(category => ({ id: category, value: category }))}
            keyExtractor={(item, index) => item?.id ?? index.toString()}

            isItemSelected={!!selected?.id}
            SelectedItemContent={<View>
                <TextTheme fontWeight={900} fontSize={14}>{selected?.value}</TextTheme>
            </View>}

            renderItemStyle={{ justifyContent: 'space-between' }}
            renderItemContent={item => (<>
                <TextTheme fontWeight={900} fontSize={14}>{item?.value}</TextTheme>
            </>)}

            filter={(item, val) => !!(
                item?.value.toLowerCase().startsWith(val)
            )}

            onSelect={setSelected}
            title="Select Category"
        />
    );
}


type GroupModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    setPrimaryVisible: Dispatch<SetStateAction<boolean>>,
    selected: { id: string, value: string },
    setSelected: Dispatch<SetStateAction<{ id: string, value: string }>>
}

function GroupModal({ visible, setVisible, selected, setSelected, setPrimaryVisible }: GroupModalProps): React.JSX.Element {
    const { productsPageMeta } = useProductStore();
    return (
        <ItemSelectorModal<{ id: string, value: string }>
            visible={visible} setVisible={() => { setVisible(false); setPrimaryVisible(false); }}
            allItems={productsPageMeta.unique_groups.map(group => ({ id: group, value: group }))}
            keyExtractor={(item, index) => item?.id ?? index.toString()}

            isItemSelected={!!selected?.id}
            SelectedItemContent={<View>
                <TextTheme fontWeight={900} fontSize={14}>{selected?.value}</TextTheme>
            </View>}

            renderItemStyle={{ justifyContent: 'space-between' }}
            renderItemContent={item => (<>
                <TextTheme fontWeight={900} fontSize={14}>{item?.value}</TextTheme>
            </>)}

            filter={(item, val) => !!(
                item?.value.toLowerCase().startsWith(val)
            )}

            onSelect={setSelected}
            title="Select Category"
        />
    );
}
