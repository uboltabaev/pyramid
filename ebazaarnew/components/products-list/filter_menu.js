import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TextInput, Keyboard } from 'react-native';
import i18n from 'i18n-js';
import _ from 'underscore';
import { AirbnbRating } from 'react-native-ratings';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { APP_MAIN_COLOR, RATING_BG_COLOR, FILTER_FREE_SHIPMENT, FILTER_RATING, FILTER_BRAND, FILTER_COLOR, FILTER_CELLULAR_STANDART, FILTER_OPERATING_SYSTEM, FILTER_PRODUCT_CONDITION, FILTER_SIM_CARDS_NUM, FILTER_INTERNAL_MEMORY, FILTER_RAM, FILTER_SCREEN_SIZE, FILTER_DISPLAY_RESOLUTION } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import FilterButton, { STATUS_DEFAULT_FILTER_BUTTON, STATUS_PRESSED_FILTER_BUTTON, STATUS_DISABLED_FILTER_BUTTON } from '../ui/filter_button';
import Collapsible from './collapsible';
import Button, { THEME_DARK_BUTTON, THEME_LIGHT_BUTTON } from '../ui/button';

const FILTER_BRAND_DATA = {
    titleI18nKey: 'brand', 
    titleDefaultText: 'Brand',
    items: [
        {id: 1, name: 'Samsung', source: require('../../../assets/images/companies/samsung_w.png')},
        {id: 2, name: 'Apple', source: require('../../../assets/images/companies/apple.png')},
        {id: 3, name: 'Huawei', source: require('../../../assets/images/companies/huawei2_w.png')},
        {id: 4, name: 'Honor', source: require('../../../assets/images/companies/honor_w.png')},
        {id: 5, name: 'Xiaomi', source: require('../../../assets/images/companies/xiaomi_w.png')},
        {id: 6, name: 'Oppo', source: require('../../../assets/images/companies/oppo_w.png')},
        {id: 7, name: 'Vivo', source: require('../../../assets/images/companies/vivo_w.png')},
        {id: 8, name: 'LG', source: require('../../../assets/images/companies/lg_w.png')},
        {id: 9, name: 'Lenovo', source: require('../../../assets/images/companies/lenovo_w.png')},
        {id: 10, name: 'ZTE', source: require('../../../assets/images/companies/zte_w.png')},
        {id: 11, name: 'Alcatel', source: require('../../../assets/images/companies/alcatel_w.png')},
        {id: 12, name: 'Meizu', source: require('../../../assets/images/companies/meizu_w.png')}
    ]
};

const FILTER_COLOR_DATA = {
    titleI18nKey: 'color', 
    titleDefaultText: 'Цвет',
    items: [
        {id: 1, name: 'Black', i18nKey: 'color:black', defaultText: 'Чёрный'},
        {id: 2, name: 'Multicolor', i18nKey: 'multi_color', defaultText: 'Многоцветный'}
    ]
};

const FILTER_CELLULAR_STANDARTS_DATA = {
    titleI18nKey: 'cellular_standards', 
    titleDefaultText: 'Стандарты сотовый связи',
    items: [
        {id: 1, name: '2G (GSM)', i18nKey: 'cellular_standards:gsm', defaultText: '2G (GSM)'},
        {id: 2, name: '3G (WCDMA)', i18nKey: 'cellular_standards:wcdma', defaultText: '3G (WCDMA)'},
        {id: 3, name: 'CDMA2000', i18nKey: 'cellular_standards:cdma2000', defaultText: 'CDMA2000'},
        {id: 4, name: '4G (LTE)', i18nKey: 'cellular_standards:lte', defaultText: '4G (LTE)'},
        {id: 5, name: '5G', i18nKey: 'cellular_standards:5g', defaultText: '5G'}
    ]
};

const FILTER_OPERATING_SYSTEM_DATA = {
    titleI18nKey: 'operating_system', 
    titleDefaultText: 'Операционная система',
    items: [
        {id: 1, name: 'Android', i18nKey: 'operating_system:android', defaultText: 'Android'},
        {id: 2, name: 'Blackberry', i18nKey: 'operating_system:blackberry', defaultText: 'Blackberry'},
        {id: 3, name: 'Linux', i18nKey: 'operating_system:linux', defaultText: 'Linux'},
        {id: 4, name: 'Symbian', i18nKey: 'operating_system:symbian', defaultText: 'Symbian'},
        {id: 5, name: 'Windows Mobile', i18nKey: 'operating_system:windows_mobile', defaultText: 'Windows Mobile'},
        {id: 6, name: 'iOS', i18nKey: 'operating_system:iOS', defaultText: 'iOS'},
        {id: 7, name: 'OMS', i18nKey: 'operating_system:OMS', defaultText: 'OMS'}
    ]
};

const FILTER_PRODUCT_CONDITION_DATA = {
    titleI18nKey: 'product_condition', 
    titleDefaultText: 'Состояние товара',
    items: [
        {id: 1, name: 'New', i18nKey: 'product_condition:new', defaultText: 'New'},
        {id: 2, name: 'Repaired', i18nKey: 'product_condition:repaired', defaultText: 'Восстановленный'},
        {id: 3, name: 'Second-hand', i18nKey: 'product_condition:second_hand', defaultText: 'Бывший в употребление'},
    ]
};

const FILTER_SIM_CARDS_NUM_DATA = {
    titleI18nKey: 'sim_cards_num', 
    titleDefaultText: 'Количество SIM-карт',
    items: [
        {id: 1, name: '2', i18nKey: 'sim_cards_num:2', defaultText: '2'},
        {id: 2, name: '1', i18nKey: 'sim_cards_num:1', defaultText: '1'},
        {id: 3, name: '3', i18nKey: 'sim_cards_num:3', defaultText: '3'},
        {id: 4, name: '4', i18nKey: 'sim_cards_num:4', defaultText: '4'},
        {id: 5, name: '1 eSIM', i18nKey: 'sim_cards_num:1eSIM', defaultText: '1 eSIM'},
        {id: 6, name: '1 SIM + 1 eSIM', i18nKey: 'sim_cards_num:1SIM+1eSIM', defaultText: '1 SIM + 1 eSIM'},
    ]
};

const FILTER_INTERNAL_MEMORY_DATA = {
    titleI18nKey: 'internal_memory', 
    titleDefaultText: 'Встроенная память',
    items: [
        {id: 1, name: '<2 GB', i18nKey: 'internal_memory:<2GB', defaultText: '<2 ГБ'},
        {id: 2, name: '2 GB', i18nKey: 'internal_memory:2GB', defaultText: '2 ГБ'},
        {id: 3, name: '4 GB', i18nKey: 'internal_memory:4GB', defaultText: '4 ГБ'}
    ]
};

const FILTER_RAM_DATA = {
    titleI18nKey: 'RAM', 
    titleDefaultText: 'Оперативная память',
    items: [
        {id: 1, name: '256 MB', i18nKey: 'RAM:256MB', defaultText: '256 МБ'},
        {id: 2, name: '512 MB', i18nKey: 'RAM:512MB', defaultText: '512 МБ'},
        {id: 3, name: '1 GB', i18nKey: 'RAM:1GB', defaultText: '1 ГБ'},
        {id: 4, name: '2 GB', i18nKey: 'RAM:2GB', defaultText: '2 ГБ'}
    ]
};

const FILTER_SCREEN_SIZE_DATA = {
    titleI18nKey: 'screen_size', 
    titleDefaultText: 'Размер экрана, дюймов',
    items: [
        {id: 1, name: '2.0'},
        {id: 2, name: '2.2'},
        {id: 3, name: '2.4'},
        {id: 4, name: '2.8'},
    ]
};

const FILTER_DISPLAY_RESOLUTION_DATA = {
    titleI18nKey: 'display_resolution', 
    titleDefaultText: 'Разрешение дисплея',
    items: [
        {id: 1, name: '480x320'},
        {id: 2, name: '480x360'},
        {id: 3, name: '640x360'},
        {id: 4, name: '800x480'},
    ]
};

const FilterMenu = React.memo(({ filters, toggleFilter, cancelFilter, onFilterMenuClose }) => {

    const _toggleFilter = (name, value) => {
        if (_.isFunction(toggleFilter))
            toggleFilter(name, value);
    }

    const _cancelFilter = () => {
        if (_.isFunction(cancelFilter))
            cancelFilter();
    }

    const _onFilterMenuClose = () => {
        if (_.isFunction(onFilterMenuClose))
            onFilterMenuClose();
    }

    const minI18n = i18n.t('min', {defaultValue: 'Мин.'}),
        maxI18n = i18n.t('max', {defaultValue: 'Макс.'})

        return (
            <View style={CssHelper['drawer']}>
                <KeyboardAwareScrollView enableOnAndroid={true} 
                    keyboardOpeningTime={0}
                    enableResetScrollToCoords={false}
                    style={CssHelper['drawer.content']} 
                    onScrollBeginDrag={Keyboard.dismiss} 
                    keyboardShouldPersistTaps="always"
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {i18n.t('categories', {defaultValue: 'Категории'})}
                        </Text>
                        <View style={CssHelper['flexRowCentered']}>
                            <FilterButton status={STATUS_DISABLED_FILTER_BUTTON}>
                                <Text>
                                    {i18n.t('category:smartphones&accessories:mobile_phones', {defaultValue: 'Мобильные телефоны'})}
                                </Text>
                            </FilterButton>
                            <View style={CssHelper['verticalDivider']}></View>
                            <View style={CssHelper['flex']}></View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {i18n.t('special_services', {defaultValue: 'Специальные услуги и рейтинги'})}
                        </Text>
                        <View style={CssHelper['flexRowCentered']}>
                            <FilterButton status={filters[FILTER_FREE_SHIPMENT] ? STATUS_PRESSED_FILTER_BUTTON : STATUS_DEFAULT_FILTER_BUTTON} onPress={() => _toggleFilter(FILTER_FREE_SHIPMENT)}>
                                <Text style={CssHelper['font12Centered']}>
                                    {i18n.t('free_shipping', {defaultValue: 'Бесплатная доставка'})}
                                </Text>
                            </FilterButton>
                            <View style={CssHelper['verticalDivider']}></View>
                            <FilterButton status={filters[FILTER_RATING] ? STATUS_PRESSED_FILTER_BUTTON : STATUS_DEFAULT_FILTER_BUTTON} onPress={() => _toggleFilter(FILTER_RATING)}>
                                <AirbnbRating starStyle={{margin: 0}} showRating={false} isDisabled={true} size={16} defaultRating={4} selectedColor={APP_MAIN_COLOR} reviewColor={RATING_BG_COLOR}/>
                                <Text style={CssHelper['ratingText']}>
                                    {i18n.t('or_more', {defaultValue: 'или более'})}
                                </Text>
                            </FilterButton>
                        </View>
                    </View>
                    <Collapsible data={FILTER_BRAND_DATA} section={FILTER_BRAND} visibleRows={2} colNum={3} type="image" selectedFilter={filters[FILTER_BRAND]} toggleFilter={_toggleFilter}/>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {i18n.t('price', {defaultValue: 'Цена'})}
                        </Text>
                        <View style={CssHelper['flexRowCentered']}>
                            <TextInput keyboardType="numeric" placeholder={minI18n} style={CssHelper['textInput']}/>
                            <Text style={styles.priceDivider}>-</Text>
                            <TextInput keyboardType="numeric" placeholder={maxI18n} style={CssHelper['textInput']}/>
                        </View>
                        <View style={[CssHelper['flexRowCentered'], {marginTop: 10}]}>
                            <View style={styles.priceOption}>
                                <Text numberOfLines={1} style={styles.priceOptionT1}>655155-1343200</Text>
                                <Text style={styles.priceOptionT2}>Выбор 41%</Text>
                            </View>
                            <View style={CssHelper['verticalDivider']}></View>
                            <View style={styles.priceOption}>
                                <Text numberOfLines={1} style={styles.priceOptionT1}>1343200-21926523</Text>
                                <Text style={styles.priceOptionT2}>Выбор 32%</Text>
                            </View>
                            <View style={CssHelper['verticalDivider']}></View>
                            <View style={styles.priceOption}>
                                <Text numberOfLines={1} style={styles.priceOptionT1}>21926523-5365220</Text>
                                <Text style={styles.priceOptionT2}>Выбор 17%</Text>
                            </View>
                        </View>
                    </View>
                    <Collapsible data={FILTER_COLOR_DATA} section={FILTER_COLOR} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_COLOR]} toggleFilter={_toggleFilter}/>
                    <Collapsible data={FILTER_CELLULAR_STANDARTS_DATA} section={FILTER_CELLULAR_STANDART} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_CELLULAR_STANDART]} toggleFilter={_toggleFilter}/>
                    <Collapsible data={FILTER_OPERATING_SYSTEM_DATA} section={FILTER_OPERATING_SYSTEM} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_OPERATING_SYSTEM]} toggleFilter={_toggleFilter}/>
                    <Collapsible data={FILTER_PRODUCT_CONDITION_DATA} section={FILTER_PRODUCT_CONDITION} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_PRODUCT_CONDITION]} toggleFilter={_toggleFilter}/>
                    <Collapsible data={FILTER_SIM_CARDS_NUM_DATA} section={FILTER_SIM_CARDS_NUM} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_SIM_CARDS_NUM]} toggleFilter={_toggleFilter}/>
                    <Collapsible data={FILTER_INTERNAL_MEMORY_DATA} section={FILTER_INTERNAL_MEMORY} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_INTERNAL_MEMORY]} toggleFilter={_toggleFilter}/>
                    <Collapsible data={FILTER_RAM_DATA} section={FILTER_RAM} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_RAM]} toggleFilter={_toggleFilter}/>
                    <Collapsible data={FILTER_SCREEN_SIZE_DATA} section={FILTER_SCREEN_SIZE} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_SCREEN_SIZE]} toggleFilter={_toggleFilter}/>
                    <Collapsible data={FILTER_DISPLAY_RESOLUTION_DATA} section={FILTER_DISPLAY_RESOLUTION} visibleRows={1} colNum={2} selectedFilter={filters[FILTER_DISPLAY_RESOLUTION]} toggleFilter={_toggleFilter}/>
                </KeyboardAwareScrollView>
                <View style={CssHelper['footer.buttons']}>
                    <View style={CssHelper['footer.buttons.inner']}>
                        <Button theme={THEME_LIGHT_BUTTON} i18nKey="cancel" defaultText="Сброс" onPress={_cancelFilter}/>
                        <Button theme={THEME_DARK_BUTTON} i18nKey="done" defaultText="Готово" onPress={_onFilterMenuClose}/>
                    </View>
                </View>
            </View>
        )    
})

const styles = StyleSheet.create({
    section: {
        borderColor: '#f2f2f2',
        borderTopWidth: 1,
        paddingTop: 15,
        paddingBottom: 15
    },
    sectionTitle: {
        fontWeight: "bold",
        paddingBottom: 15
    },
    priceDivider: {
        paddingLeft: 10,
        paddingRight: 10,
        color: "#9e9e9e"
    },
    priceOption: {
        flex: 1,
        backgroundColor: '#f2f2f2', 
        borderRadius: 4, 
        padding: 5
    },
    priceOptionT1: {
        textAlign: 'center',
        fontWeight: 'bold', 
        fontSize: 12
    },
    priceOptionT2: {
        textAlign: 'center', 
        fontSize: 12, 
        color: '#666666'
    }
});

FilterMenu.propTypes = {
    filters: PropTypes.object,
    toggleFilter: PropTypes.func,
    cancelFilter: PropTypes.func,
    onFilterMenuClose: PropTypes.func
}

export default FilterMenu;