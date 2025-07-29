/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useState } from 'react';
import BottomModal from './BottomModal';
import { Text, View } from 'react-native';
import NoralTextInput from '../Ui/TextInput/NoralTextInput';
import MaterialIcon from '../Icon/MaterialIcon';
import { useAlert } from '../Ui/Alert/AlertProvider';
import FeatherIcon from '../Icon/FeatherIcon';
import TextTheme from '../Ui/Text/TextTheme';
import { useTheme } from '../../Contexts/ThemeProvider';


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    message: string,
    passkey: string,
    handleDelete: () => void
}

export default function DeleteModal({ visible, setVisible, message, passkey, handleDelete }: Props): React.JSX.Element {

    const [text, setText] = useState<string>('');
    const { primaryColor } = useTheme();
    const { setAlert } = useAlert();

    function handleOnDelete() {
        if (text !== passkey) {
            return setAlert({
                id: 'delete-modal', message: 'To delete, enter the valid keyword !!!', type: 'error',
            });
        }

        handleDelete();
    }

    return (
        <BottomModal
            alertId="delete-modal"
            visible={visible}
            setVisible={setVisible}
            style={{ padding: 20, gap: 8 }}
            actionButtons={[{
                title: 'Delete', onPress: handleOnDelete, backgroundColor: 'rgb(250,10,50)', color: 'white',
                icon: <MaterialIcon name="delete" size={20} color="white" />,
            }]}
        >
            <Text style={{ color: 'rgb(250,10,50)', fontSize: 20, fontWeight: 900 }} >Delete Warning</Text>
            <TextTheme style={{ fontWeight: 700, fontSize: 14 }} >{message}</TextTheme>


            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, gap: 12, borderColor: primaryColor }} >
                <FeatherIcon name="key" size={20} />

                <NoralTextInput
                    placeholder={passkey}
                    style={{ fontSize: 18, fontWeight: 900, flex: 1 }}
                    onChangeText={setText}
                />
            </View>
            <TextTheme style={{ fontWeight: 700, fontSize: 14 }} >
                {`Type "${passkey}" for delete`}
            </TextTheme>

            <View style={{ minHeight: 40 }} />
        </BottomModal>
    );
}
