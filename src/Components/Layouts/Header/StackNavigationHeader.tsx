/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import AnimateButton from '../../Ui/Button/AnimateButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamsList } from '../../../Navigation/StackNavigation';
import FeatherIcon from '../../Icon/FeatherIcon';
import TextTheme from '../../Ui/Text/TextTheme';

export default function StackNavigationHeader({title}: {title: string}): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'tab-navigation'>>();

    return (
        <View style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10, gap: 8}} >
            <AnimateButton
                onPress={() => navigation.goBack()}
                style={{borderRadius: 40, padding: 10}}
            >
                <FeatherIcon name="chevron-left" size={22} />
            </AnimateButton>

            <TextTheme fontSize={20} fontWeight={700}>{title}</TextTheme>
        </View>
    );
}
