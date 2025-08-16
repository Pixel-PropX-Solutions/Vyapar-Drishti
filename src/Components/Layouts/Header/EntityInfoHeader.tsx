/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import AnimateButton from '../../Ui/Button/AnimateButton';
import FeatherIcon from '../../Icon/FeatherIcon';
import MaterialIcon from '../../Icon/MaterialIcon';
import { useTheme } from '../../../Contexts/ThemeProvider';
import navigator from '../../../Navigation/NavigationService';
import ShowWhen from '../../Other/ShowWhen';
import TextTheme from '../../Ui/Text/TextTheme';
import DeleteModal from '../../Modal/DeleteModal';
import { useState } from 'react';


type Props = {
    onPressEdit?: () => void,
    onPressDelete: () => void,
    invoiceNumber: string,
}

export default function EntityInfoHeader({ onPressEdit, onPressDelete, invoiceNumber }: Props): React.JSX.Element {

    const { secondaryBackgroundColor: color } = useTheme();
    const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

    return (
        <>
            <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', paddingInline: 20, justifyContent: 'space-between' }} >
                <AnimateButton
                    style={{ borderRadius: 50, borderWidth: 2, padding: 8, borderColor: color }}
                    onPress={() => navigator.goBack()}
                >
                    <FeatherIcon name="plus" size={20} style={{ transform: [{ rotate: '45deg' }] }} />
                </AnimateButton>

                <View style={{ gap: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <ShowWhen when={!!onPressEdit}>
                        <AnimateButton
                            onPress={onPressEdit}
                            style={{ borderRadius: 100, height: 44, paddingInline: 20, borderWidth: 2, borderColor: color, gap: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgb(50,150,250)' }}
                        >
                            <FeatherIcon name="edit-3" size={20} color={'white'} />
                            <TextTheme fontSize={14} fontWeight={900} color="white">Edit</TextTheme>
                        </AnimateButton>
                    </ShowWhen>

                    <AnimateButton
                        onPress={() => setDeleteModalVisible(true)}
                        style={{ width: 44, aspectRatio: 1, borderRadius: 100, backgroundColor: 'crimson', opacity: 0.9, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <MaterialIcon name="delete-outline" size={22} color={'white'} />
                    </AnimateButton>
                </View>
            </View>
            <DeleteModal
                visible={isDeleteModalVisible}
                setVisible={() => setDeleteModalVisible(false)}
                handleDelete={() => {
                    onPressDelete();
                    setDeleteModalVisible(false);
                }}
                message="Are you sure you want to delete this Invoice? This action cannot be undone."
                passkey={invoiceNumber}
            />
        </>
    );
}
