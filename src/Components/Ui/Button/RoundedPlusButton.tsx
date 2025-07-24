import { useTheme } from "../../../Contexts/ThemeProvider";
import FeatherIcon from "../../Icon/FeatherIcon";
import AnimateButton from "./AnimateButton";


type Props = {
    size?: number,
    iconSize?: number,
    rotate?: number,
    backgroundColor?: string,
    color?: string,
    onPress?: () => void
}

export default function RoundedPlusButton({size=44, iconSize=20, rotate=0, backgroundColor, color, onPress=()=>{}}: Props): React.JSX.Element {

    const {primaryBackgroundColor, primaryColor} = useTheme();

    color = color ?? primaryBackgroundColor;
    backgroundColor = backgroundColor ?? primaryColor;

    return (
        <AnimateButton
            style={{width: size, aspectRatio: 1, borderRadius: size, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor}}
            bubbleColor={color}
            onPress={onPress}
        >
            <FeatherIcon name="plus" color={color} size={iconSize} style={{transform: [{rotate: `${rotate}deg`}]}} />
        </AnimateButton>
    )
}