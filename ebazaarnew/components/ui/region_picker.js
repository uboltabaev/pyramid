import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';
import _, { union } from 'underscore';
import Ripple from 'react-native-material-ripple';
import Modal from "react-native-modal";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'; 
import { TabView, SceneMap } from 'react-native-tab-view';
import { observer, inject } from 'mobx-react';
import { APP_FORM_COLOR, SCREEN_WIDTH, LANGS, APP_MAIN_COLOR } from "../../constants/app";
import CssHelper from '../../helpers/css_helper';
import ScrollViewHorizontal from './scrollview_hor';
import XIcon from '../icons/x2_icon';
import MyRipple from './ripple';
import TouchableHighlight from './touchable_highlight';
import CheckIcon from '../icons/check_icon';

export const TABS_INDEXES = Object.freeze({
    REGION: 0,
    CITY: 1
});

const TAB_CONTENT_MODE = Object.freeze({
    REGION: 'region',
    CITY: 'subRegion'
});

const sort = (sub_regions, locale) => {
    if (locale === LANGS.RU)
        return sub_regions
    const districts = [],
        cities = []
    _.each(sub_regions, (s) => {
        if (s[locale].search('туман') !== -1)
            districts.push(s)
        else
            cities.push(s)
    });
    return union(cities, _.sortBy(districts, locale))
}

const TabContent = inject('mobxStore')(observer(({ mobxStore, regions, mode, close }) => {
    const [scrollbarVisibility, setScrollbarVisibility] = useState(false)

    const locale = i18n.locale
    let timeOut, timeOut2, timeOut3

    useEffect(() => {
        return () => {
            clearTimeout(timeOut)
            clearTimeout(timeOut2)
            clearTimeout(timeOut3)    
        }
    }, [])

    useEffect(() => {
        timeOut = setTimeout(()=> {
            setScrollbarVisibility(true)
        }, 300)
    }, [mobxStore.regionsStore.tabIndex])

    const selectRegion = (id) => {
        const v = {
            selectedRegionId: id,
            tabIndex: 1
        };
        mobxStore.regionsStore.selectedRegionId !== id && (v.selectedSubRegionId = null)
        mobxStore.regionsStore.setValues(v)
        timeOut2 = setTimeout(() => {
            mobxStore.regionsStore.setTabIndex(1)
        }, 0)
    }
    
    const selectSubRegion = (id) => {
        mobxStore.regionsStore.setValues({
            selectedSubRegionId: id
        })
        if (_.isFunction(close))
            close()
    }

    const { selectedRegionId, selectedSubRegionId, selectedRegionArr } = mobxStore.regionsStore

    if (mode === TAB_CONTENT_MODE.REGION) {
        return (
            <ScrollViewHorizontal scrollbarVisibility={scrollbarVisibility}>
                <View style={CssHelper['flex']}>
                    { regions.map((region, i) =>
                        <Ripple key={i} 
                            style={CssHelper['flex']} 
                            rippleCentered={false} 
                            rippleSequential={true} 
                            rippleFades={false} 
                            rippleOpacity={0.10} 
                            rippleDuration={250}
                            onPress={() => selectRegion(region.getId())}
                        >
                            <View style={[CssHelper["menu.button"], styles['menu.button']]}>
                                <Text style={CssHelper['menu.button.text']}>
                                    {region[locale]}
                                </Text>
                                { region.getId() === selectedRegionId &&
                                    <CheckIcon width={16} height={16} color={APP_FORM_COLOR}/>
                                }
                            </View>
                        </Ripple>
                    )}
                </View>
            </ScrollViewHorizontal>
        )
    } else {
        if (_.isNull(selectedRegionId)) {
            return (
                <View style={CssHelper['flexSingleCentered']}>
                    <ActivityIndicator color={APP_MAIN_COLOR} size="small"/>
                </View>
            )
        }
        return (
            <ScrollViewHorizontal scrollbarVisibility={scrollbarVisibility}>
                <View style={CssHelper['flex']}>
                    { selectedRegionArr.map((region, i) => {
                        const sub_regions = sort(region.sub_regions, locale);
                        return (
                            <View key={i} style={(selectedRegionArr.length - 1) > i ? styles.regionContainer : styles.lastContainer}>
                                <Text style={[CssHelper['menu.button.text'], styles.regionTitle]}>
                                    {region[locale]}
                                </Text>
                                { sub_regions.map((sub_region, index) =>
                                    <Ripple key={index} 
                                        rippleCentered={false} 
                                        rippleSequential={true} 
                                        rippleFades={false} 
                                        rippleOpacity={0.10} 
                                        rippleDuration={250}
                                        onPress={() => selectSubRegion(sub_region.id)}
                                    >
                                        <View style={[CssHelper["menu.button"], styles['menu.button2']]}>
                                            <Text style={CssHelper['menu.button.text']}>
                                                {sub_region[locale]}
                                            </Text>
                                            { (region.id === selectedRegionId && sub_region.id === selectedSubRegionId) &&
                                                <CheckIcon width={16} height={16} color={APP_FORM_COLOR}/>
                                            }
                                        </View>
                                    </Ripple>
                                )}
                            </View>
                        )
                    })}
                </View>
            </ScrollViewHorizontal>
        )
    }    
}))

const routes = [
    {key: 'first', title: i18n.t('shipping_address:republic/region', {defaultValue: 'Республика/область'})},
    {key: 'second', title: i18n.t('shipping_address:city', {defaultValue: 'Город'})}
]

const RegionPicker = inject('mobxStore')(observer(({ mobxStore, regions, isVisible, close }) => {
    const setIndex = (v) => {
        mobxStore.regionsStore.setTabIndex(v)
    }

    const RenderScene = SceneMap({
        first: () => (
            <TabContent regions={regions} mode={TAB_CONTENT_MODE.REGION} close={_close}/>
        ),
        second: () => (
            <TabContent regions={regions} mode={TAB_CONTENT_MODE.CITY} close={_close}/>
        )
    })

    const _close = () => {
        if (_.isFunction(close)) {
            setTimeout(() => {
                close()
            }, 1)
        }
    }

    const renderTabBar = (props) => {
        return null
    }

    const onIndexChange = (index) => {}

    const tabIndex = mobxStore.regionsStore.tabIndex

    return (
        <Modal useNativeDriver={true} 
            animationIn={'fadeInUp'} 
            animationOut={'fadeOut'} 
            backdropTransitionInTiming={600} 
            backdropTransitionOutTiming={500}
            animationOutTiming={150} 
            style={styles.modal} 
            isVisible={isVisible}
            onBackdropPress={_close}
            backdropOpacity={0}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={[CssHelper['flexRowCentered'], {justifyContent: 'flex-start'}]}>
                        <MyRipple onPress={_close} pressColor={"#fff"}>
                            <View style={styles.xContainer}>
                                <XIcon width={12} height={12} color="#000"/>
                            </View>
                        </MyRipple>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{i18n.t('select', {defaultValue: 'Выберите'})}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.breadcrumb}>
                    <ScrollView horizontal persistentScrollbar={true} showsVerticalScrollIndicator={true}>
                        <View style={[CssHelper['flexRowCentered'], {justifyContent: 'flex-start'}]}>
                            <TouchableHighlight style={styles.breadcrumbButton} onPress={() => setIndex(0)}>
                                <View style={CssHelper['flexSingleCentered']}>
                                    <Text style={[styles.breadcrumbText, tabIndex === 0 && (styles.breadcrumbSelected)]}>
                                        {i18n.t('shipping_address:republic/region', {defaultValue: 'Республика/область'})}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <View style={styles.breadcrumbDivider}>
                                <SimpleLineIcons name="arrow-right" size={20} color="#ccc"/> 
                            </View>
                            <TouchableHighlight style={styles.breadcrumbButton} onPress={() => setIndex(1)}>
                                <View style={CssHelper['flexSingleCentered']}>
                                    <Text style={[styles.breadcrumbText, tabIndex === 1 && (styles.breadcrumbSelected)]}>
                                        {i18n.t('shipping_address:city', {defaultValue: 'Город'})}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.content}>
                    <TabView navigationState={{ index: tabIndex, routes }}
                        renderScene={RenderScene}
                        onIndexChange={onIndexChange}
                        initialLayout={{width: SCREEN_WIDTH}}
                        renderTabBar={renderTabBar}
                    />
                </View>
            </View>
        </Modal>
    )
}))

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        marginTop: 55
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 0.7,
        height: 50,
        paddingHorizontal: 20,
        paddingLeft: 15
    },
    content: {
        flex: 1
    },
    xContainer: {
        padding: 5,
    },
    titleContainer: {
        paddingLeft: 20
    },
    title: {
        fontSize: 15,
        color: '#3b3d49'
    },
    regionContainer: {
        paddingTop: 0,
        borderBottomWidth: 1.0,
        borderBottomColor: '#ebebeb',
        marginBottom: 10,
        paddingBottom: 10
    },
    lastContainer: {
        paddingTop: 0,
        paddingBottom: 10
    },
    regionTitle: {
        paddingHorizontal: 20,
        fontWeight: 'bold',
        paddingTop: 15,
        paddingBottom: 15
    },
    "menu.button": {
        paddingLeft: 20,
        paddingRight: 5
    },
    "menu.button2": {
        paddingLeft: 40,
        paddingRight: 5
    },
    breadcrumb: {
        height: 44,
        paddingHorizontal: 15
    },
    breadcrumbButton: {
        paddingHorizontal: 5
    },
    breadcrumbText: {
        color: '#000',
        fontSize: 15,
        textAlign: 'center'
    },
    breadcrumbSelected: {
        color: APP_FORM_COLOR
    },
    breadcrumbDivider: {
        marginHorizontal: 15
    }
});

RegionPicker.propTypes = {
    isVisible: PropTypes.bool,
    regions: PropTypes.array,
    close: PropTypes.func
}

RegionPicker.defaultProps = {
    isVisible: false,
    regions: []
}

export default RegionPicker;