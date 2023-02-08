import React, { useReducer, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { observer, inject } from 'mobx-react';
import { useSelector } from "react-redux";
import i18n from 'i18n-js';
import { TextField } from '@softmedialab/react-native-material-textfield';
import postalCodes from 'postal-codes-js';
import _ from 'underscore';
import RegionsDb from '../../firebase/regions';
import { UserShippingAddress } from '../../firebase/user_shipping_addresses';
import { APP_FORM_COLOR, COUTRY_ISO2_CODE, COUNTRY_CALLING_CODE } from '../../constants/app';
import CssHelper from "../../helpers/css_helper";
import MiscHelper from '../../helpers/misc_helper';
import MaskHelper, { MASK_TYPES, CUSTOM_MASKS } from '../../helpers/mask_helper';
import DarkPage from "../../components/misc/dark_page";
import RegionPicker, { TABS_INDEXES } from '../../components/ui/region_picker';
import ShadowButton from '../../components/ui/shadow_button';
import ClearInput from '../../components/ui/clear_input';
import SwitchI from '../../components/ui/switchi';
import DropDownIcon from '../../components/icons/drop_down_icon';

const MODE = Object.freeze({
    ADD: 'add',
    EDIT: 'edit'
});

const ShippingAddressFormContainer = inject('mobxStore')(observer(({ mobxStore, route, navigation }) => {
    const params = route.params;
    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            mode: MODE.ADD,
            isPageBlocked: false,
            contactPerson: '',
            contactPersonFocused: false,
            contactPersonError: '',
            phoneNumber: '',
            phoneNumberFocused: false,
            phoneNumberError: '',
            streetAddress: '',
            streetAddressError: '',
            streetAddressFocused: false,
            apartmentAddress: '',
            apartmentAddressFocused: false,
            region: '',
            regionError: '',
            subRegion: '',
            subRegionError: '',
            postcode: '',
            postcodeFocused: false,
            postcodeError: '',
            asDefault: false,
            shippingAddress: null,
            isFormReady: false,
            opacity: _.isUndefined(params) ? new Animated.Value(1) : new Animated.Value(0),
            isMounted
        }
    )

    const { 
        mode,
        isPageBlocked,
        contactPerson,
        contactPersonFocused,
        contactPersonError,
        phoneNumber,
        phoneNumberFocused,
        phoneNumberError,
        streetAddress,
        streetAddressError,
        streetAddressFocused,
        apartmentAddress,
        apartmentAddressFocused,
        region,
        regionError,
        subRegion,
        subRegionError,
        postcode,
        postcodeFocused,
        postcodeError,
        asDefault,
        shippingAddress,
        isFormReady,
        opacity,
        isMounted
     } = state

    const {
        regions, 
        selectedRegionId, 
        selectedRegion, 
        selectedSubRegionId,
        isVisible, 
        selectedSubRegion,
        regionsLoaded 
    } = mobxStore.regionsStore

    const isNetConnected = useSelector(state => state.main.isNetConnected)

    const refs = {
        contactPersonRef: useRef(null),
        phoneNumberRef: useRef(null),
        streetAddressRef: useRef(null),
        apartmentAddressRef: useRef(null),
        regionRef: useRef(null),
        subRegionRef: useRef(null),
        postcodeRef: useRef(null)        
    }

    const { contactPersonRef, phoneNumberRef, streetAddressRef, apartmentAddressRef, regionRef, subRegionRef, postcodeRef } = refs
    const maskHelper = new MaskHelper(MASK_TYPES.CUSTOM, CUSTOM_MASKS.USER_CELL_PHONE)

    useEffect(() => {
        async function _getRegions() {
            return await getRegions()
        }

        setState({
            isMounted: true
        })

        if (isNetConnected && !regionsLoaded)
            _getRegions();

        const unsubscribe = navigation.addListener('blur', () => {
            mobxStore.regionsStore.setValues({
                selectedRegionId: null,
                selectedSubRegionId: null
            })
        })

        // Check if it is edit mode or not
        if (!_.isUndefined(params)) {
            const {id} = params,
                shippingAddress = mobxStore.userStore.getShippingAddress(id);

            if (_.isObject(shippingAddress)) {
                setState({
                    ...shippingAddress.toForm(),
                    mode: MODE.EDIT,
                    shippingAddress,
                    isFormReady: true
                })

                mobxStore.regionsStore.setValues({
                    selectedRegionId: shippingAddress.getRegionId(),
                    selectedSubRegionId: shippingAddress.getSubRegionId()
                })
            }
        }

        Animated.timing(opacity, {
            toValue: 1,
            useNativeDriver: true,
            duration: 300
        }).start()

        return () => {
            unsubscribe();
            setState({
                isMounted: false
            })
        }
    }, [])

    useEffect(() => {

    }, [contactPersonRef])

    useEffect(() => {
        if (selectedRegion && isMounted) {
            const v = selectedRegion[i18n.locale];
            setState({
                region: v,
                regionError: ''
            })
            regionRef.current.setValue(v);
        }
    }, [selectedRegionId])

    useEffect(() => {
        if (selectedSubRegion && isMounted) {
            const v = selectedSubRegion[i18n.locale];
            setState({
                subRegion: v,
                subRegionError: ''
            });
            subRegionRef.current.setValue(v);
        }
    }, [selectedSubRegionId])

    const getFormValues = () => {
        const fields = [
            'contactPerson',
            'phoneNumber',
            'streetAddress',
            'apartmentAddress',
            'region',
            'subRegion',
            'city',
            'postcode',
            'asDefault'
        ];
        let v = {};
        _.each(fields, (val) => {
            switch (val) {
                case 'region':
                    v[val] = mobxStore.regionsStore.selectedRegionData;
                    break;
                case 'subRegion':
                    v[val] = selectedSubRegion;
                    break;
                default: 
                    v[val] = state[val];
            }
        });
        return v;
    }

    const getRegions = async () => {
        const regions = await RegionsDb.getRegionsWithSubRegions()
        mobxStore.regionsStore.setValues({
            regions,
            regionsLoaded: true
        })
    }

    const toggleModalVisibility = (index) => {
        const v = {
            isVisible: !isVisible
        }
        if (!_.isUndefined(index)) {
            if (_.isNull(selectedRegionId))
                index = TABS_INDEXES.REGION;
            v.tabIndex = index
        }
        mobxStore.regionsStore.setValues(v)
    }

    const validateField = (name, text, returnValue = false) => {
        const filtered = typeof text === 'string' ? text.trim() : text,
            v = {};
        switch (name) {
            case 'contactPerson':
                v[name] = text;
                v[name + 'Error'] = filtered.length > 0 ? '' : i18n.t('errors:contactName:empty', {defaultValue: 'Пожалуйста, укажите имя и фамилию получателя'});
                break;
            case 'streetAddress':
                v[name] = text;
                v[name + 'Error'] = filtered.length > 0 ? '' : i18n.t('errors:enterStreetAddress', {defaultValue: 'Пожалуйста, введите название улицы'});
                break;
            case 'apartmentAddress':
                v[name] = text;
                break;
            case 'region':
                v[name] = text;
                v[name + 'Error'] = text.length === 0 ? i18n.t('errors:enterRegion', {defaultValue: 'Пожалуйста, укажите республика/область'}) : '';
                break;                
            case 'subRegion':
                v[name] = text;
                v[name + 'Error'] = text.length === 0 ? i18n.t('errors:enterCity', {defaultValue: 'Пожалуйста, укажите город/район'}) : '';
                break;
            case 'phoneNumber':
                v.phoneNumber = text;
                if (text.length === 0) {
                    v.phoneNumberError = i18n.t('errors:mobile:error', {defaultValue: 'Пожалуйста, введите номер мобильного'});
                } else {
                    if (!maskHelper.validate(text))
                        v.phoneNumberError = i18n.t('errors:mobile:9Symbols', {defaultValue: 'Пожалуйста, введите 9 символов'});
                    else
                        v.phoneNumberError = '';
                }
                break;
            case 'postcode':
                v[name] = text;
                if (text.length === 0) {
                    v.postcodeError = i18n.t('errors:enterPostcode', {defaultValue: 'Пожалуйста, укажите почтовый индекс'});
                } else {
                    if (postalCodes.validate(COUTRY_ISO2_CODE, text) === true)
                        v.postcodeError = '';
                    else
                        v.postcodeError = i18n.t('errors:enterPostcodeExample', {defaultValue: 'Введите почтовый индекс, например 123456'});
                }
                break;
        }
        if (returnValue)
            return v;
        else 
            setState(v);
    }

    const onFocus = (name) => {
        const v = {};
        v[name + 'Focused'] = true;
        setState(v);
    }

    const onBlur = (name) => {
        const v = {};
        v[name + 'Focused'] = false;
        setState(v);
    }

    const clearInput = (name) => {
        const v = {}
        v[name] = ''
        setState(v)
        refs[name + 'Ref'].current.setValue('');
        refs[name + 'Ref'].current.focus();
    }

    const onSwitchToggle = (asDefault) => {
        setState({
            asDefault
        })
    }

    const save = () => {
        const required = [
            'contactPerson',
            'phoneNumber',
            'streetAddress',
            'region',
            'subRegion',
            'postcode'
        ];
        let v = {}, errorsCount = 0

        _.each(required, (val) => {
            const returned = validateField(val, state[val], true);
            for (let prop in returned) {
                if (returned.hasOwnProperty(prop)) {
                    v[prop] = returned[prop];
                    if (prop.search('Error') !== -1 && returned[prop].length > 0)
                        errorsCount ++;
                }
            }
        })

        if (errorsCount === 0) {
            Keyboard.dismiss();
            setState({
                isPageBlocked: true
            })

            const _shippingAddress = mode === MODE.EDIT 
                ? shippingAddress 
                : new UserShippingAddress()
            
            const data = getFormValues()
            mode === MODE.ADD && (data.user_id = mobxStore.userStore.uid)

            _shippingAddress.save(data).then((savedShippingAddress) => {
                if (mode === MODE.ADD)
                    mobxStore.userStore.addShippingAddress(savedShippingAddress);
                else
                    mobxStore.userStore.replaceShippingAddress(savedShippingAddress);
                setState({
                    isPageBlocked: false
                })
                navigation.navigate('SettingsShippingAddresses')
            }, (error) => {
                console.log(error);
                MiscHelper.alertError();
                setState({
                    isPageBlocked: false
                })
            });
        } else
            setState(v)
    }

    return (
        <DarkPage i18nKey="add_shipping_address" 
            defaultText="Добавить адрес доставки" 
            navigation={navigation}
            activityIndicator={!regionsLoaded}
            isBlocked={isPageBlocked}
            fadeOut={isFormReady && mode === MODE.EDIT}
        >
            <Animated.View style={[CssHelper['flex'], {opacity}]}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        <View style={styles.notes}>
                            <Text style={styles.notesText}>
                                {i18n.t('add_product_note', {defaultValue: 'Поля, помеченные звёздочкой (*), обязательны к заполнению.'})}
                            </Text>
                        </View>
                        <View style={styles.fields}>
                            <TextField animationDuration={150}
                                ref={contactPersonRef}
                                label={i18n.t('shipping_address:contact_person', {defaultValue: 'Контактное лицо'})}
                                fontSize={14}
                                containerStyle={styles.containerStyle}
                                activeLineWidth={1.5}
                                errorColor={APP_FORM_COLOR}
                                onChangeText={(e) => validateField('contactPerson', e)}
                                onFocus={() => onFocus('contactPerson')}
                                onBlur={() => onBlur('contactPerson')}
                                value={contactPerson}
                                error={contactPersonError}
                                blurOnSubmit={false}
                                returnKeyType='next'
                                enablesReturnKeyAutomatically={true}
                                onSubmitEditing={() => phoneNumberRef.current.focus()}
                            />
                            { (contactPersonFocused && contactPerson.length > 0) &&
                                <ClearInput style={styles.clearInput} onPress={() => clearInput('contactPerson')}/>
                            }
                        </View>
                        <View style={[CssHelper['flexRowCentered'], styles.phoneContainer]}>
                            <View style={styles.phoneCountryCode}>
                                <TextField animationDuration={25}
                                    fontSize={14}
                                    containerStyle={styles.containerStyle}
                                    activeLineWidth={1.5}
                                    errorColor={APP_FORM_COLOR}
                                    value={COUNTRY_CALLING_CODE}
                                    editable={false}
                                />
                            </View>
                            <Text style={styles.divider}>-</Text>
                            <View style={CssHelper['flex']}>
                                <TextField animationDuration={150}
                                    ref={phoneNumberRef}
                                    label={i18n.t('shipping_address:phone_number', {defaultValue: 'Номер мобильного'})}
                                    fontSize={14}
                                    containerStyle={styles.containerStyle}
                                    activeLineWidth={1.5}
                                    errorColor={APP_FORM_COLOR}
                                    keyboardType='numeric'
                                    onFocus={() => onFocus('phoneNumber')}
                                    onBlur={() => onBlur('phoneNumber')}    
                                    onChangeText={(e) => validateField('phoneNumber', e)}
                                    formatText={(text) => {
                                        return maskHelper.getValue(text);
                                    }}
                                    value={phoneNumber}
                                    error={phoneNumberError}
                                    blurOnSubmit={false}
                                    returnKeyType='next'
                                    enablesReturnKeyAutomatically={true}
                                    onSubmitEditing={() => streetAddressRef.current.focus()}
                                    maxLength={14}
                                />
                                { (phoneNumberFocused && phoneNumber.length > 0) &&
                                    <ClearInput style={styles.clearInput} onPress={() => clearInput('phoneNumber')}/>
                                }
                            </View>
                        </View>
                        <View style={styles.fields}>
                            <TextField animationDuration={150}
                                ref={streetAddressRef}
                                label={i18n.t('shipping_address:street_address', {defaultValue: 'Улица, название махалля и т.п.'})}
                                fontSize={14}
                                containerStyle={styles.containerStyle}
                                activeLineWidth={1.5}
                                errorColor={APP_FORM_COLOR}
                                onChangeText={(e) => validateField('streetAddress', e)}
                                onFocus={() => onFocus('streetAddress')}
                                onBlur={() => onBlur('streetAddress')}
                                value={streetAddress}
                                error={streetAddressError}
                                blurOnSubmit={false}
                                returnKeyType='next'
                                enablesReturnKeyAutomatically={true}
                                onSubmitEditing={() => apartmentAddressRef.current.focus()}
                            />
                            { (streetAddressFocused && streetAddress.length > 0) &&
                                <ClearInput style={styles.clearInput} onPress={() => clearInput('streetAddress')}/>
                            }
                        </View>
                        <View style={styles.fields}>
                            <TextField animationDuration={150}
                                ref={apartmentAddressRef}
                                label={i18n.t('shipping_address:apartment_address', {defaultValue: 'Квартира, корпус, и т.п.'})}
                                fontSize={14}
                                containerStyle={styles.containerStyle}
                                activeLineWidth={1.5}
                                errorColor={APP_FORM_COLOR}
                                onChangeText={(e) => validateField('apartmentAddress', e)}
                                onFocus={() => onFocus('apartmentAddress')}
                                onBlur={() => onBlur('apartmentAddress')}
                                value={apartmentAddress}
                            />
                            { (apartmentAddressFocused && apartmentAddress.length > 0) &&
                                <ClearInput style={styles.clearInput} onPress={() => clearInput('apartmentAddress')}/>
                            }
                        </View>
                        <TouchableWithoutFeedback onPress={() => toggleModalVisibility(TABS_INDEXES.REGION)}>
                            <View style={styles.fields}>
                                <TextField animationDuration={150}
                                    ref={regionRef}
                                    label={i18n.t('shipping_address:republic/region', {defaultValue: 'Республика/область'})}
                                    fontSize={14}
                                    containerStyle={styles.containerStyle}
                                    activeLineWidth={1.5}
                                    errorColor={APP_FORM_COLOR}
                                    value={region}
                                    editable={false}
                                    error={regionError}
                                />
                                <View style={styles.dropdown}>
                                    <DropDownIcon width={12} height={12} color="#333"/>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => toggleModalVisibility(TABS_INDEXES.CITY)}>
                            <View style={styles.fields}>
                                <TextField animationDuration={150}
                                    ref={subRegionRef}
                                    label={i18n.t('shipping_address:city', {defaultValue: 'Город'})}
                                    fontSize={14}
                                    containerStyle={styles.containerStyle}
                                    activeLineWidth={1.5}
                                    errorColor={APP_FORM_COLOR}
                                    value={subRegion}
                                    editable={false}
                                    error={subRegionError}
                                />
                                <View style={styles.dropdown}>
                                    <DropDownIcon width={12} height={12} color="#333"/>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.fields}>
                            <TextField animationDuration={150}
                                ref={postcodeRef}
                                label={i18n.t('shipping_address:postcode', {defaultValue: 'Почтовый индекс'})}
                                fontSize={14}
                                containerStyle={styles.containerStyle}
                                activeLineWidth={1.5}
                                errorColor={APP_FORM_COLOR}
                                onChangeText={(e) => validateField('postcode', e)}
                                keyboardType='numeric'
                                onFocus={() => onFocus('postcode')}
                                onBlur={() => onBlur('postcode')}
                                value={postcode}
                                error={postcodeError.length > 0 ? postcodeError : ''}
                            />
                            { (postcodeFocused && postcode.length > 0) &&
                                <ClearInput style={styles.clearInput} onPress={() => clearInput('postcode')}/>
                            }
                        </View>
                        <View style={[styles.setDefault, CssHelper['flexRowCentered']]}>
                            <Text>
                                {i18n.t('shipping_address:set_as_default_address', {defaultValue: 'Задать как адрес по-умолчанию'})}
                            </Text>
                            <SwitchI isEnabled={asDefault} onToggle={onSwitchToggle}/>
                        </View>
                        <View style={styles.submit}>
                            <ShadowButton i18nKey="save" 
                                defaultText="Сохранить" 
                                elevation={1}
                                onPress={save}
                            />
                        </View>
                    </View>
                </ScrollView>
                <RegionPicker isVisible={isVisible}
                    regions={regions} 
                    close={toggleModalVisibility}
                />
            </Animated.View>
        </DarkPage>
    )
}))

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15
    },
    submit: {
        marginTop: 30
    },
    setDefault: {
        marginTop: 10
    },
    notes: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10
    },
    notesText: {
        fontSize: 12,
        color: '#999999',
        lineHeight: 18
    },
    containerStyle: {
        marginTop: -15
    },
    phoneContainer: {
        alignItems: 'flex-start'
    },
    phoneCountryCode: {
        width: 32
    },
    divider: {
        paddingHorizontal: 10,
        fontWeight: 'bold',
        paddingTop: 18
    },
    clearInput: {
        position: 'absolute', 
        top: 15, 
        right: 0
    },
    dropdown: {
        position: 'absolute',
        right: 5,
        top: 20
    }
});

export default ShippingAddressFormContainer;