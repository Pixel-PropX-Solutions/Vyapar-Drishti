/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { ItemSelectorModal } from './Selectors/ItemSelectorModal';
import TextTheme from '../Ui/Text/TextTheme';
type CountryInfo = { name: string, states: string[] };

const countryData: CountryInfo[] = require('../../Assets/Jsons/country-states.json');

export function CountrySelectorModal({ visible, setVisible, country, field = 'mailing_country', setCountry }: {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    country: string,
    field?: string,
    setCountry: (field: string, value: string) => void
}): React.JSX.Element {

    const selected = (countryData.find(item => item.name === country) ?? null);

    function updateCountry(countryInfo: CountryInfo) {
        setCountry(field, countryInfo.name);
    }

    return (
        <ItemSelectorModal<CountryInfo>
            title="Select Country"
            allItems={countryData}
            isItemSelected={!!selected}
            keyExtractor={(item) => item.name}
            filter={(item, val) => (
                item.name.toLowerCase().startsWith(val) ||
                item.states.some(state => state.toLowerCase().startsWith(val))
            )}
            onSelect={updateCountry}
            visible={visible}
            setVisible={setVisible}
            SelectedItemContent={
                <View>
                    <TextTheme color="white" fontSize={14} >
                        {selected?.name}
                    </TextTheme>
                </View>
            }

            renderItemContent={(item) => (<>
                <TextTheme fontSize={16} >{item.name}</TextTheme>
            </>)}
        />
    );
}
