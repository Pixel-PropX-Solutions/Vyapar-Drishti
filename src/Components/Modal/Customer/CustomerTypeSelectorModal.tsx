/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import TextTheme from '../../Ui/Text/TextTheme';
import { useAppDispatch, useCustomerStore } from '../../../Store/ReduxStore';
import BottomModal from '../../../Components/Modal/BottomModal';
import { accountGroups } from '../../../Utils/accountGroups';
import AnimateButton from '../../Ui/Button/AnimateButton';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import { setCustomerType } from '../../../Store/Reducers/customerReducer';
import { useTheme } from '../../../Contexts/ThemeProvider';
import MaterialDesignIcon from '../../../Components/Icon/MaterialDesignIcon';

type Props = {
    visible: boolean,
    setVisible: (vis: boolean) => void,
    setSecondaryVisible: (vis: boolean) => void,
}

export default function CustomerTypeSelectorModal({ visible, setVisible, setSecondaryVisible }: Props): React.JSX.Element {
    const { primaryColor, secondaryBackgroundColor } = useTheme();
    const dispatch = useAppDispatch();
    const { customerType } = useCustomerStore();

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
            style={{ paddingHorizontal: 20, paddingBottom: 40 }}
            onClose={() => {
                dispatch(setCustomerType(null));
            }}
        >
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    marginBottom: 16,
                }} />
                <TextTheme fontSize={24} fontWeight={"bold"}>
                    Create new Customer
                </TextTheme>
                <TextTheme fontSize={14} style={{ opacity: 0.7, marginTop: 4 }}>
                    Select the type of customer you want to create
                </TextTheme>
            </View>

            <View style={{ gap: 10 }}>
                {accountGroups.filter(group => ['Debtors', 'Creditors'].includes(group.accounting_group_name)).map(group => (
                    <AnimateButton
                        key={group._id}
                        style={{
                            borderRadius: 16,
                            padding: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 16,
                            borderWidth: 1,
                            paddingInline: 16,
                            paddingBlock: 10,
                            borderColor: group.accounting_group_name === customerType?.accounting_group_name ? primaryColor : secondaryBackgroundColor,
                            backgroundColor: group.accounting_group_name === customerType?.accounting_group_name ? `${primaryColor}20` : secondaryBackgroundColor,
                        }}
                        onPress={() => {
                            dispatch(setCustomerType(group));
                            setSecondaryVisible(true);
                        }}
                    >
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: group.accounting_group_name === 'Debtors' ? '#4CAF50' : '#F44336',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <MaterialDesignIcon name={group.accounting_group_name === 'Debtors' ? 'account-multiple-plus-outline' : 'store-plus-outline'} size={24} color="#FFFFFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextTheme fontSize={16} fontWeight={"bold"} color={group.accounting_group_name === customerType?.accounting_group_name ? primaryColor : 'black'}>
                                {group.accounting_group_name}
                            </TextTheme>
                            <TextTheme fontSize={12} color={group.accounting_group_name === customerType?.accounting_group_name ? primaryColor : 'black'} style={{ opacity: 0.7, marginTop: 2 }}>
                                {group.description}
                            </TextTheme>
                        </View>

                        <FeatherIcon name="chevron-right" size={20} />
                    </AnimateButton>
                ))}
            </View>
        </BottomModal>
    );
}
