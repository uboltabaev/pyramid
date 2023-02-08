import React, { useReducer, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import i18n from 'i18n-js';
import _ from 'underscore';
import { observer, inject } from 'mobx-react';
import UserShippingAddressesDb from '../../firebase/user_shipping_addresses';
import { APP_MAIN_COLOR, LINK_COLOR, APP_MAIN_COLOR_OPACITY_10, COUNTRY_CALLING_CODE } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import MiscHelper from '../../helpers/misc_helper';
import DarkPage, { DARK_PAGE_MODE } from "../../components/misc/dark_page";
import Checkbox, { STATUS_CHECKED, STATUS_UNCHECKED } from '../../components/ui/checkbox';

const inline = (...args) => {
    const arr = [...args];
    return arr.join(', ');
}

const ShippingAddressesContainer = inject('mobxStore')(observer(({ mobxStore, navigation }) => {
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            isPageBlocked: false,
            darkPageMode: DARK_PAGE_MODE.DEFAULT,
            selectedAddresses: [],
            errorLoading: false
        }
    )

    const { isPageBlocked, darkPageMode, selectedAddresses, errorLoading } = state
    let timeout = null, timeout2 = null

    useEffect(() => {
        loadData()

        return () => {
            clearTimeout(timeout)
            clearTimeout(timeout2)    
        }
    }, [])

    const isSelected = (id) => {
        const selected = selectedAddresses.find(a => a === id)
        return _.isUndefined(selected) ? false : true;
    }

    const selectAddress = (id) => {
        const selected = isSelected(id)
        if (selected) {
            const filtered = selectedAddresses.filter(a => a !== id)
            setState({
                selectedAddresses: filtered
            })
        } else {
            setState({
                selectedAddresses: [...selectedAddresses, id]
            })
        }
    }

    const selectedAddressesLength = () => {
        return selectedAddresses.length;
    }

    const loadData = () => {
        const isLoaded = mobxStore.userStore.isShippingAddressesLoaded,
            uid = mobxStore.userStore.uid
        if (!isLoaded) {
            UserShippingAddressesDb.getUserShippingAddresses(uid).then((shippingAddresses) => {
                mobxStore.userStore.setValues({
                    isShippingAddressesLoaded: true,
                    shippingAddresses
                })
            }, (error) => {
                setState({
                    errorLoading: true
                })
            });
        }
    }

    const refreshPage = () => {
        setState({
            errorLoading: false
        })

        timeout2 = setTimeout(() => {
            loadData()
        }, 800)
    }

    const onError = () => {
        MiscHelper.alertError()
        setState({
            isPageBlocked: false
        })
    }

    const toggleEdit = () => {
        switch(darkPageMode) {
            case DARK_PAGE_MODE.DEFAULT:
                setState({
                    darkPageMode: DARK_PAGE_MODE.EDIT
                })
                break
            case DARK_PAGE_MODE.EDIT:
                setState({
                    darkPageMode: DARK_PAGE_MODE.DEFAULT
                })
                break
        }
    }

    const setDefault = async(id) => {
        setState({
            isPageBlocked: true,
        })
        try {
            const shippingAddress = await UserShippingAddressesDb.setAsDefault(id)
            if (_.isObject(shippingAddress))
                mobxStore.userStore.setDefaultShippingAddress(shippingAddress);
            timeout = setTimeout(() => {
                setState({
                    isPageBlocked: false
                })
            }, 500)    
        } catch (error) {
            console.log(error)
            onError()
        }
    }

    const _delete = async() => {
        setState({
            isPageBlocked: true,
        })
        try {
            for await (let id of selectedAddresses) {
                await UserShippingAddressesDb.delete(id);
            }
            mobxStore.userStore.removeShippingAddress(selectedAddresses)

            setState({
                isPageBlocked: false,
                darkPageMode: DARK_PAGE_MODE.DEFAULT,
                selectedAddresses: []
            })
        } catch (error) {
            MiscHelper.alertError();
            setState({
                isPageBlocked: false,
            })
        }
    }

    const editLink = (id) => {
        navigation.navigate('SettingsShippingAddressForm', {
            id
        })
    }

    const isLoaded = mobxStore.userStore.isShippingAddressesLoaded,
        shippingAddresses = mobxStore.userStore.shippingAddresses

    return (
        <DarkPage i18nKey="settings:delivery_addresses" 
            defaultText="Адреса доставки" 
            navigation={navigation}
            isBlocked={isPageBlocked}
            mode={darkPageMode}
            displayEditIcon={shippingAddresses.length > 0 && isLoaded && !isPageBlocked}
            editHandler={toggleEdit}
            activityIndicator={!isLoaded && !errorLoading}
            refreshPage={errorLoading}
            refreshHandler={refreshPage}
            backgroundColor="#ebebeb"
        >
            <View style={styles.content}>
                { shippingAddresses.length > 0 ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        { shippingAddresses.map((address, i) =>
                            <View key={i} style={[CssHelper['flexRowCentered'], styles.addressContainerOuter, i === 0 && ({marginTop: 15})]}>
                                { darkPageMode === DARK_PAGE_MODE.EDIT &&
                                    <View>
                                        <TouchableOpacity activeOpacity={1} style={styles.checkboxLink} onPress={() => selectAddress(address.getId())}>
                                            <Checkbox status={isSelected(address.getId()) ? STATUS_CHECKED : STATUS_UNCHECKED} 
                                                backgroundColor="transparent"
                                                borderColor="#6f6f6f"
                                            />
                                        </TouchableOpacity>
                                        <Text>{isSelected(address.getId())}</Text>
                                    </View>
                                }
                                <View style={[styles.addressContainer, address.getAsDefault() && ({paddingTop: 27})]}>
                                    { address.getAsDefault() &&
                                        <View style={styles.default}>
                                            <Text style={styles.defaultText}>
                                                {i18n.t('default', {defaultValue: 'По-умолчанию'})}
                                            </Text>
                                        </View>
                                    }
                                    <View style={styles.locationPin}>
                                        <SimpleLineIcons name="location-pin" size={24} color="#333333"/>
                                    </View>
                                    <View style={CssHelper['flex']}>
                                        <Text numberOfLines={1} style={styles.normalText}>
                                            {inline(address.getContactPerson(), COUNTRY_CALLING_CODE + ' ' + address.getPhoneNumber())}
                                        </Text>
                                        <Text numberOfLines={1} style={styles.boldText}>
                                            {inline(address.getStreetAddress())}
                                        </Text>
                                        <Text numberOfLines={1} style={styles.boldText}>
                                            {inline(address.getSubRegionName(), address.getRegionName(), address.getPostcode())}
                                        </Text>
                                        <View style={styles.links}>
                                            <TouchableOpacity style={[CssHelper['flex'], CssHelper['linkMargin5']]} activeOpacity={1.0} onPress={() => editLink(address.getId())}>
                                                <Text style={styles.link}>
                                                    {i18n.t('action:edit', {defaultValue: 'Редактировать'})}
                                                </Text>
                                            </TouchableOpacity>
                                            { address.getAsDefault() ? (
                                                <View style={CssHelper['flex']}/>
                                            ) : (
                                                <TouchableOpacity style={[CssHelper['flex'], CssHelper['linkMargin5']]} activeOpacity={1.0} onPress={() => setDefault(address.getId())}>
                                                    <Text style={styles.link}>
                                                        {i18n.t('action:set_as_default', {defaultValue: 'Установить по умолчанию'})}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                ) : (
                    <View style={CssHelper['flexSingleCentered']}>
                        <MaterialIcons name="location-on" size={72} color="#d3d3d3"/>
                        <Text style={styles.noAddresses}>
                            {i18n.t('no_saved_addresses', {defaultValue: 'Нет сохранённых адресов.'})}
                        </Text>
                    </View>
                )}
            </View>
            { (darkPageMode === DARK_PAGE_MODE.DEFAULT && shippingAddresses.length < 5) &&
                <TouchableOpacity activeOpacity={1} style={styles.buttonContainer} onPress={() => navigation.navigate('SettingsShippingAddressForm')}>
                    <View style={CssHelper['flexSingleCentered']}>
                        <Text style={styles.buttonText}>
                            {i18n.t('add_shipping_address', {defaultValue: 'Добавить адрес доставки'})}
                        </Text>
                    </View>
                </TouchableOpacity>
            }
            { darkPageMode === DARK_PAGE_MODE.EDIT && selectedAddressesLength() > 0 &&
                <TouchableOpacity activeOpacity={1} style={styles.buttonContainer} onPress={_delete}>
                    <View style={CssHelper['flexSingleCentered']}>
                        <Text style={styles.buttonText}>
                            {i18n.t('action:delete', {defaultValue: 'Удалить'})}
                        </Text>
                    </View>
                </TouchableOpacity>
            }
        </DarkPage>
    )    
}))

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#ebebeb',
        paddingHorizontal: 15
    },
    buttonContainer: {
        backgroundColor: APP_MAIN_COLOR,
        height: 50
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 14.5
    },
    noAddresses: {
        color: '#afb2b7',
        fontSize: 13,
        paddingTop: 7,
        textAlign: 'center'
    },
    addressContainerOuter: {
        marginBottom: 15
    },
    addressContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        flex: 1,
        flexDirection: 'row'
    },
    locationPin: {
        marginRight: 10
    },
    boldText: {
        fontWeight: 'bold',
        lineHeight: 22
    },
    normalText: {
        lineHeight: 22
    },
    links: {
        marginTop: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    link: {
        textTransform: 'uppercase',
        color: LINK_COLOR,
        fontWeight: 'bold',
        lineHeight: 18,
        fontSize: 13
    },
    default: {
        position: 'absolute',
        backgroundColor: APP_MAIN_COLOR_OPACITY_10(),
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    defaultText: {
        color: APP_MAIN_COLOR,
        fontSize: 11.5,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 1.5
    },
    checkboxLink: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 15
    }
});

export default ShippingAddressesContainer;