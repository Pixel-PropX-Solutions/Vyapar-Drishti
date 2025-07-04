import React, { Dispatch, SetStateAction } from 'react';
import {
    View,
    TouchableOpacity,
    LayoutAnimation,
} from 'react-native';
import TextTheme from '../Text/TextTheme';
import FeatherIcon from '../Icon/FeatherIcon';

type Props = {
    expanded: boolean;
    setExpanded: Dispatch<SetStateAction<boolean>>;
    header: string;
    children?: React.ReactNode;
}

export default function CollapsabeMenu({ header, children, expanded, setExpanded }: Props): React.JSX.Element {

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View >
            <TouchableOpacity onPress={toggleExpand} style={{
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
            }}>
                <TextTheme style={{ color: 'white', fontSize: 18 }}>{header}</TextTheme>
                <FeatherIcon name={expanded ? "chevron-up" : "chevron-down"} size={28} />
            </TouchableOpacity>

            {expanded && (
                <View style={{
                    padding: 5,
                    borderRadius: 6,
                }}>
                    {children}
                </View>
            )}
        </View>
    );
}

