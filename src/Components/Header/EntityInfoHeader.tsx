/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import AnimateButton from '../Button/AnimateButton';
import FeatherIcon from '../Icon/FeatherIcon';
import { Text } from 'react-native-gesture-handler';
import MaterialIcon from '../Icon/MaterialIcon';
import { useTheme } from '../../Contexts/ThemeProvider';
import navigator from '../../Navigation/NavigationService';
import ShowWhen from '../Other/ShowWhen';


type Props = {
    onPressEdit?: () => void,
    onPressDelete?: () => void
}

export default function EntityInfoHeader({ onPressEdit, onPressDelete }: Props): React.JSX.Element {

    const { secondaryBackgroundColor: color } = useTheme();

    return (
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
                        <Text style={{ fontSize: 14, fontWeight: '900', color: 'white' }}>Edit</Text>
                    </AnimateButton>
                </ShowWhen>

                <ShowWhen when={!!onPressDelete} >
                    <AnimateButton
                        onPress={onPressDelete}
                        style={{ width: 44, aspectRatio: 1, borderRadius: 100, backgroundColor: 'crimson', opacity: 0.9, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <MaterialIcon name="delete-outline" size={22} color={'white'} />
                    </AnimateButton>
                </ShowWhen>
            </View>
        </View>
    );
}
