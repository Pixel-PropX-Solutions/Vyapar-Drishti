import { View, ViewStyle } from "react-native";
import { useTheme } from "../../Contexts/ThemeProvider";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "../Button/AnimateButton";
import ShowWhen from "../Other/ShowWhen";
import FeatherIcon from "../Icon/FeatherIcon";
import BackgroundThemeView from "./BackgroundThemeView";


type Props = { 
    label: string,
    children: React.ReactNode,
    style?: ViewStyle,
    containerStyle?: ViewStyle,
    labelColor?: string,
    labelContainerChildren?: React.JSX.Element
}

export default function SectionView({label, children, style, containerStyle, labelColor, labelContainerChildren}: Props): React.JSX.Element {

    return (
        <View style={containerStyle}>
            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 12}} >
                <TextTheme isPrimary={false} style={{paddingLeft: 4, fontWeight: '900', fontSize: 20}} color={labelColor} >
                    {label}
                </TextTheme>
                {labelContainerChildren}
            </View>

            <View style={style}>
                {children}
            </View>
        </View>
    )
}

type SectionRowProps = {
    backgroundColor?: string,
    isPrimary?: boolean,
    onPress?: () => void,
    children?: React.ReactNode,
    label?: string,
    style?: ViewStyle,
    isLabelPrimary?: boolean,
    gap?: number
}

export function SectionRow({isPrimary=false, backgroundColor, onPress, children, label='', style, isLabelPrimary=false, gap=12}: SectionRowProps): React.JSX.Element {

    const {secondaryBackgroundColor, primaryBackgroundColor} = useTheme();
    if(!backgroundColor) backgroundColor = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;


    return (
        <AnimateButton 
            style={{padding: 12, borderRadius: 12, backgroundColor, width: '100%', gap}}
            onPress={onPress}
            bubbleScale={30}
        >
            <ShowWhen when={label !== ''}>
                <TextTheme isPrimary={isLabelPrimary} style={{fontWeight: '900'}}>{label}</TextTheme>
            </ShowWhen>
            <View style={[{flexDirection: 'row', alignItems: 'center'}, style]} >
                {children}
            </View>
        </AnimateButton>
    )
}


type SectionArrowRow = { 
    text: string,
    onPress: () => void,
    icon?: React.ReactNode,
    backgroundColor?: string,
    isPrimary?: boolean,
    arrowSize?: number,
    textColor?: string
}

export function SectionArrowRow({isPrimary=false, backgroundColor, onPress, text, icon, arrowSize=24, textColor}: SectionArrowRow): React.JSX.Element { 

    const {secondaryBackgroundColor, primaryBackgroundColor} = useTheme();
    if(!backgroundColor) backgroundColor = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;

    return <AnimateButton
        style={{padding: 20, borderRadius: 16, backgroundColor, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
        onPress={onPress}
        bubbleScale={30}
    >
        <View style={{alignItems: 'center', flexDirection: 'row', gap: 16}} >
            {icon}
            <TextTheme color={textColor} style={{fontWeight: '900', fontSize: 16}} >{text}</TextTheme>
        </View>

        <FeatherIcon name="arrow-right" size={arrowSize} color={textColor} />
    </AnimateButton>
}


type SectionRowWithIcon = { 
    label: string,
    text: string,
    onPress: () => void,
    icon?: React.ReactNode,
    isPrimary?: boolean,
    hasArrow?: boolean,
    backgroundColor?: string,
    color?: string,
    children?: React.ReactNode,
    iconContainerColor?: string
}

export function SectionRowWithIcon({isPrimary=false, onPress, label, text, icon, hasArrow=false, backgroundColor='', color, children, iconContainerColor=''}: SectionRowWithIcon): React.JSX.Element {
    const {secondaryBackgroundColor, primaryBackgroundColor} = useTheme();
   
    if(backgroundColor === '') backgroundColor = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;
    if(iconContainerColor === '') iconContainerColor = isPrimary ? secondaryBackgroundColor : primaryBackgroundColor;


    return (
        <AnimateButton 
            onPress={onPress}
            bubbleScale={30}
            style={{padding: 12, borderRadius: 16, backgroundColor, width: '100%', alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between'}}
        >
            <View style={{alignItems: 'center', flexDirection: 'row', gap: 12, flex: 1}}>
                <View style={{alignItems: 'center', justifyContent: 'center', width: 44, aspectRatio: 1, overflow: 'hidden', borderRadius: 12, backgroundColor: iconContainerColor}} >
                    {icon}
                </View>

                <View style={{flex: 1}} >
                    <TextTheme color={color} style={{fontWeight: 900}} numberOfLines={1} >{label}</TextTheme>
                    <TextTheme color={color} isPrimary={false} style={{fontSize: 12, fontWeight: 900}} numberOfLines={2} >{text}</TextTheme>
                </View>
            </View>
        
            <ShowWhen when={hasArrow} otherwise={children} >
                <FeatherIcon name="arrow-right" size={20} color={color} />
            </ShowWhen>  
        </AnimateButton>
    )
}