/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { useTheme } from '../../Contexts/ThemeProvider';
import { useAppDispatch, useCustomerStore } from '../../Store/ReduxStore';
import BottomModal from './BottomModal';
import TextTheme from '../Ui/Text/TextTheme';
import AnimateButton from '../Ui/Button/AnimateButton';
import MaterialDesignIcon from '../Icon/MaterialDesignIcon';
import FeatherIcon from '../Icon/FeatherIcon';
import { setCustomerType } from '../../Store/Reducers/customerReducer';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
    visible: boolean,
    setVisible: (vis: boolean) => void,
    setSecondaryVisible: () => void,
}

const Icons: Record<string, string> = {
    'Capital Account': 'account-cash',
    'Loans (Liability)': 'bank',
    'Sales Account': 'sale',
    'Purchase Account': 'cart',
    'Indirect Expenses': 'cash-minus',
    'Indirect Incomes': 'cash-plus',
    'Current Assets': 'wallet',
    'Current Liabilities': 'alert-box',
    'Bank Accounts': 'bank-outline',
    'Debtors': 'account-multiple-plus-outline',
    'Creditors': 'store-plus-outline',
    'Duties & Taxes': 'file-percent',
    'Stock-in-Hand': 'warehouse',
    'Fixed Assets': 'office-building',
    'Cash-in-Hand': 'cash',
    'Direct Expenses': 'cash-remove',
    'Direct Incomes': 'cash-multiple',
    'Investments': 'chart-line',
    'Suspense Account': 'help-circle',
    'Loans (Secured & Unsecured)': 'lock',
    'Deposits (Assets)': 'safe',
    'Loans & Advances (Assets)': 'arrow-up-bold',
    'Misc. Expenses (Assets)': 'dots-horizontal',
    'Provisions': 'clipboard-list',
    'Reserve & Surplus': 'piggy-bank-outline',
};

// Color mapping for different account types
const getAccountColor = (groupName: string): string => {
    const colorMap: Record<string, string> = {
        'Capital Account': '#673AB7',
        'Loans (Liability)': '#FF9800',
        'Sales Account': '#2196F3',
        'Purchase Account': '#9C27B0',
        'Indirect Expenses': '#E91E63',
        'Indirect Incomes': '#009688',
        'Current Assets': '#8BC34A',
        'Current Liabilities': '#F44336',
        'Bank Accounts': '#00BCD4',
        'Debtors': '#4CAF50',
        'Creditors': '#FF5722',
        'Duties & Taxes': '#FFC107',
        'Stock-in-Hand': '#795548',
        'Fixed Assets': '#607D8B',
        'Cash-in-Hand': '#4CAF50',
        'Direct Expenses': '#F44336',
        'Direct Incomes': '#00BCD4',
        'Investments': '#3F51B5',
        'Suspense Account': '#9E9E9E',
        'Loans (Secured & Unsecured)': '#FFB300',
        'Deposits (Assets)': '#8D6E63',
        'Loans & Advances (Assets)': '#0097A7',
        'Misc. Expenses (Assets)': '#BA68C8',
        'Provisions': '#FF7043',
        'Reserve & Surplus': '#5C6BC0',
    };
    return colorMap[groupName] || '#757575';
};


export default function LedgerTypeSelectorModal({ visible, setVisible, setSecondaryVisible }: Props): React.JSX.Element {
    const { primaryColor } = useTheme();
    const dispatch = useAppDispatch();
    const { accountingGroups, customerType } = useCustomerStore();

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
            style={{ paddingHorizontal: 0, paddingBottom: 20 }}
            onClose={() => {
                dispatch(setCustomerType(null));
            }}
        >
            {/* Header Section */}
            <View style={{ alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 }}>
                <View style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#E0E0E0',
                    marginBottom: 20,
                }} />
                <TextTheme fontSize={26} fontWeight={'bold'} style={{ marginBottom: 6 }}>
                    Create New Ledger
                </TextTheme>
                <TextTheme fontSize={14} style={{ opacity: 0.6, textAlign: 'center', lineHeight: 20 }}>
                    Choose a ledger type to categorize your ledger
                </TextTheme>
            </View>

            {/* Scrollable List */}
            <ScrollView
                style={{ paddingHorizontal: 20 }}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
            >
                {accountingGroups.map((group) => {
                    const isSelected = group.accounting_group_name === customerType?.accounting_group_name;
                    const accountColor = getAccountColor(group.accounting_group_name);

                    return (
                        <AnimateButton
                            key={group._id}
                            style={{
                                borderRadius: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 14,
                                paddingHorizontal: 14,
                                paddingVertical: 14,
                                marginBottom: 10,
                                borderWidth: 2,
                                borderColor: isSelected ? primaryColor : '#F0F0F0',
                                backgroundColor: isSelected
                                    ? `${primaryColor}12`
                                    : '#FFFFFF',
                                shadowColor: isSelected ? primaryColor : '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isSelected ? 0.15 : 0.05,
                                shadowRadius: isSelected ? 8 : 4,
                                elevation: isSelected ? 4 : 2,
                            }}
                            onPress={() => {
                                dispatch(setCustomerType(group));
                                setSecondaryVisible();
                            }}
                        >
                            {/* Icon Container */}
                            <View style={{
                                width: 52,
                                height: 52,
                                borderRadius: 14,
                                backgroundColor: isSelected ? accountColor : `${accountColor}20`,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <MaterialDesignIcon
                                    name={Icons[group.accounting_group_name]}
                                    size={26}
                                    color={isSelected ? '#FFFFFF' : accountColor}
                                />
                            </View>

                            {/* Text Content */}
                            <View style={{ flex: 1, gap: 4 }}>
                                <TextTheme
                                    fontSize={16}
                                    fontWeight={600}
                                    color={isSelected ? primaryColor : '#1A1A1A'}
                                    style={{ lineHeight: 22 }}
                                >
                                    {group.accounting_group_name}
                                </TextTheme>
                                {group.description && (
                                    <TextTheme
                                        fontSize={13}
                                        color={isSelected ? primaryColor : '#666666'}
                                        style={{ opacity: 0.8, lineHeight: 18 }}
                                        numberOfLines={2}
                                    >
                                        {group.description}
                                    </TextTheme>
                                )}
                            </View>

                            {/* Chevron Icon */}
                            <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isSelected ? `${primaryColor}20` : '#F5F5F5',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FeatherIcon
                                    name="chevron-right"
                                    size={18}
                                    color={isSelected ? primaryColor : '#999999'}
                                />
                            </View>
                        </AnimateButton>
                    );
                })}
            </ScrollView>
        </BottomModal>
    );
}
