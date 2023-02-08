import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import _ from 'underscore';
import i18n from 'i18n-js';
import CssHelper from '../../helpers/css_helper';
import MiscHelper from "../../helpers/misc_helper";
import CollapsibleList from "../ui/collapsible_list";
import FilterButton, { STATUS_DEFAULT_FILTER_BUTTON, STATUS_PRESSED_FILTER_BUTTON } from '../ui/filter_button';

function Collapsible({ data, section, visibleRows, colNum, type, selectedFilter, toggleFilter }) {

    const _toggleFilter = (name, value) => {
        toggleFilter(name, value);
    }

    const items = MiscHelper.groupByPerItems(data.items, colNum);

    if (!selectedFilter) {
        return (
            <View style={[styles.section, {paddingTop: 5}]}>
                <CollapsibleList
                    animationConfig={{
                        duration: 100, update: { type: "linear", property: "scaleXY"}
                    }}
                    numberOfVisibleItems={visibleRows} 
                    buttonContent={
                        <Text style={styles.sectionTitle2}>
                            {i18n.t(data.titleI18nKey, {defaultValue: data.titleDefaultText})}
                        </Text>
                    }
                >
                    { items.map((group, gi) => 
                        <View key={gi} style={[CssHelper['flexRowCentered']]}>
                            { group.map((item, i) => 
                                <FilterButton key={i} status={selectedFilter === item.id ? STATUS_PRESSED_FILTER_BUTTON : STATUS_DEFAULT_FILTER_BUTTON} style={{height: 30, marginRight: ((i + 1) % colNum !== 0) ? 10 : 0, marginTop: gi > 0 ? 10 : 0}} onPress={() => _toggleFilter(section, item.id)}>
                                    { type === 'image' ? (
                                        <ImageBackground fadeDuration={0} style={styles.brand} source={item.source} resizeMode="contain"/>
                                    ) : (
                                        <Text style={CssHelper['font12Centered']}>
                                            { _.isUndefined(item.i18nKey) ? (
                                                item.name
                                            ) : (
                                                i18n.t(item['i18nKey'], {defaultValue: item['defaultText']})
                                            )}
                                        </Text>
                                    )}
                                </FilterButton>
                            )}
                            { _.times(colNum - _.size(group), (n) => {
                                return (<View key={n} style={[styles.emptyFilterButton, {marginRight: ((n + 1) < (colNum - _.size(group))) ? 10 : 0}]}></View>);
                            })}
                        </View>
                    )}
                </CollapsibleList>
            </View>
        )
    } else {
        const item = _.findWhere(data.items, {id: selectedFilter});
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    {i18n.t(data.titleI18nKey, {defaultValue: data.titleDefaultText})}
                </Text>
                <View style={[CssHelper['flexRowCentered']]}>
                    <FilterButton status={STATUS_PRESSED_FILTER_BUTTON} style={{height: 30, marginRight: 10}} onPress={() => _toggleFilter(section, item.id)}>
                        { type === 'image' ? (
                            <ImageBackground fadeDuration={0} style={styles.brand} source={item.source} resizeMode="contain"/>
                        ) : (
                            <Text style={CssHelper['font12Centered']}>
                                { _.isUndefined(item.i18nKey) ? (
                                    item.name
                                ) : (
                                    i18n.t(item['i18nKey'], {defaultValue: item['defaultText']})
                                )}
                            </Text>
                        )}
                    </FilterButton>
                    { _.times((colNum - 1), (n) => {
                        return (<View key={n} style={[styles.emptyFilterButton, {marginRight: ((n + 1) < (colNum - 1)) ? 10 : 0}]}></View>);
                    })}
                </View>
            </View>
        )
    }
}

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
    sectionTitle2: {
        fontWeight: "bold"
    },
    brand: {
        flex: 1,
        width: '100%',
        height: '100%'
    }, 
    emptyFilterButton: {
        flex: 1,
        padding: 5,
        borderWidth: 1,
        borderColor: '#fff'
    }
});

Collapsible.propTypes = {
    data: PropTypes.object.isRequired,
    section: PropTypes.string,
    visibleRows: PropTypes.number,
    colNum: PropTypes.number,
    type: PropTypes.string,
    selectedFilter: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    toggleFilter: PropTypes.func
}

Collapsible.defaultProps = {
    visibleRows: 1,
    colNum: 2,
    type: 'text',
    selectedFilter: false
}

export default Collapsible;