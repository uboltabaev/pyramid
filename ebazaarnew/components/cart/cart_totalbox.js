import React, { useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import posed from 'react-native-pose';
import i18n from 'i18n-js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Surface } from 'react-native-paper';
import CssHelper from '../../helpers/css_helper';
import MiscHelper from '../../helpers/misc_helper';
import { SET_FLASH_MESSAGE } from '../../redux/constants/action-types'
import { Position } from '../../components/ui/flash_message';
import ShadowButton from '../ui/shadow_button';
import Ripple from '../ui/ripple';
import XIcon from '../icons/x2_icon';
import Checkbox, { STATUS_CHECKED, STATUS_UNCHECKED } from '../ui/checkbox';

const TotalBox = posed.View({
    visible: {
        y: -50,
        transition: {
            y: {duration: 300},
        }
    },
    hidden: {
        y: 100,
        transition: {
            y: {duration: 300},
        }        
    }
});

const Arrow = posed.View({
    visible: {
        rotate: '180deg',
        transition: {
            rotate: {duration: 300},
        }        
    },
    hidden: {
        rotate: '0deg',
        transition: {
            rotate: {duration: 300},
        }        
    }    
});

const CartTotalBox = inject('mobxStore')(observer(React.forwardRef(({ mobxStore, navigation }, ref) => {

    const [displayTotal, setDisplayTotal] = useState(false)
    const dispatch = useDispatch()

    const selectedItems = mobxStore.cartStore.selectedCartItemsNum
    let timeout = null

    useEffect(() => {
        return () => {
            clearTimeout(timeout);
        }
    }, [])

    useImperativeHandle(ref, () => ({
        closeTotalBox() {
            if (displayTotal)
                setDisplayTotal(false)
        },
        deleteItem() {
            if (selectedItems > 0) {
                Alert.alert(
                    i18n.t('action:delete', {defaultValue: 'Удалить'}),
                    i18n.t('messages:deleteItemsQuestion', {defaultValue: 'Вы уверены, что хотите удалить выбранные товары?'}),
                    [
                        {
                            text: i18n.t('cancel2', {defaultValue: 'Отмена'}),
                        },            
                        {
                            text: i18n.t('action:delete', {defaultValue: 'Удалить'}),
                            onPress: () => {
                                console.log('Delete...');
                            }
                        }
                    ]
                );
            } else {
                const eError = i18n.t('messages:selectItems', {defaultValue: 'Выберите товары для удаления'})
                dispatch({
                    type: SET_FLASH_MESSAGE,
                    payload: {
                        text: eError,
                        position: Position.BOTTOM
                    }
                })
            }    
        }
    }))

    const displayTotalEv = useCallback((delay = false) => {
        if (delay) {
            timeout = setTimeout(() => {
                setDisplayTotal(value => !value)
            }, 200);
        } else {
            setDisplayTotal(value => !value)
        }
    })
    
    const checkAll = useCallback(() => {
        mobxStore.cartStore.checkAll()
    }, [])
    
    const selectedCartItemsSum = mobxStore.cartStore.selectedCartItemsSum,
        selectedCartItemsShipmentSum = mobxStore.cartStore.selectedCartItemsShipmentSum,
        isCheckedAllSelected = mobxStore.cartStore.isCheckedAllSelected,
        selectedCartItemsTotalSum = mobxStore.cartStore.selectedCartItemsTotalSum,
        selectedCartItemsNum = mobxStore.cartStore.selectedCartItemsNum

    return (
        <>
            <TotalBox pose={displayTotal ? 'visible' : 'hidden'} style={styles.totalBox}>
                <Surface style={[styles.cardStyle]}>
                    <View style={styles.totalBoxHeader}>
                        <View style={[CssHelper['flexRowCentered'], {justifyContent: 'flex-start'}]}>
                            <Ripple onPress={() => displayTotalEv(true)}>
                                <View style={styles.xIcon}>
                                    <XIcon width={12} height={12} color="#333"/>
                                </View>
                            </Ripple>
                            <Text style={styles.totalBoxHeaderText}>
                                {i18n.t('about_order', {defaultValue: 'О заказе'})}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.totalBoxContent, CssHelper['flex']]}>
                        <View style={CssHelper['flexRowCentered']}>
                            <Text style={styles.totalText}>
                                {i18n.t('cost', {defaultValue: 'Стоимость'})}:
                            </Text>
                            <Text style={styles.totalText}>
                                {MiscHelper.price(selectedCartItemsSum)}
                            </Text>
                        </View>
                        <View style={CssHelper['flexRowCentered']}>
                            <Text style={styles.totalText}>
                                {i18n.t('shipment', {defaultValue: 'Доставка'})}:
                            </Text>
                            <Text style={styles.totalText}>
                                {MiscHelper.price(selectedCartItemsShipmentSum)}
                            </Text>
                        </View>
                    </View>
                </Surface>
            </TotalBox>
            <View style={styles.confirmBar}>
                <View style={CssHelper['flexRowCentered']}>
                    <View>
                        <View style={[CssHelper['flexRowCentered'], styles.checkAll]}>
                            <TouchableOpacity activeOpacity={1} onPress={checkAll} style={[CssHelper['standartLink'], styles.checkAllLink]}>
                                <Checkbox status={isCheckedAllSelected ? STATUS_CHECKED : STATUS_UNCHECKED}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[CssHelper['flexRowCentered'], styles.sumContainer]}>
                        <Ripple onPress={displayTotalEv}>
                            <View style={[CssHelper['flexRowCentered']]}>
                                <Text style={styles.sum}>
                                    {MiscHelper.price(selectedCartItemsTotalSum)}
                                </Text>
                                <Arrow style={styles.arr} pose={displayTotal ? 'visible' : 'hidden'}>
                                    <Ionicons name="ios-arrow-down" size={16} color="black"/>
                                </Arrow>
                            </View>
                        </Ripple>
                    </View>
                    <View>
                        <ShadowButton i18nKey="pay" 
                            defaultText="Оплатить" 
                            i18nProps={{amount: selectedCartItemsNum}} 
                            style={{width: 140}}
                            textStyle={{fontSize: 14}}
                        />
                    </View>
                </View>
            </View>
        </>
    )
})))

const styles = StyleSheet.create({
    confirmBar: {
        height: 65, 
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 10
    },
    checkAll: {
        justifyContent: 'flex-start',
        maxWidth: 70,
    },
    checkAllLink: {
        paddingRight: 13
    },
    sumContainer: {
        justifyContent: 'flex-end',
        marginRight: 10
    },
    sum: {
        fontWeight: 'bold',
        fontSize: 15,
        paddingRight: 7
    },
    arr: {
        marginTop: 3
    },
    totalBox: {
        position: 'absolute', 
        height: 135, 
        width: '100%', 
        bottom: 0, 
        left: 0, 
        backgroundColor: '#fff'
    },
    cardStyle: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingTop: 4,
        elevation: 8
    },
    totalBoxHeader: {
        height: 36
    },
    xIcon: {
        padding: 5
    },
    totalBoxHeaderText: {
        fontSize: 18,
        marginLeft: 30,
        lineHeight: 21
    },
    totalBoxContent: {
        paddingTop: 15,
        paddingBottom: 20
    },
    totalText: {
        fontSize: 12
    }
});

CartTotalBox.propTypes = {
    language: PropTypes.string
}

export default CartTotalBox;