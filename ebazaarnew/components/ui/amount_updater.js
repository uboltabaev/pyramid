import React, { useReducer, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import UserCartDb from '../../firebase/user_cart';
import { APP_MAIN_COLOR } from '../../constants/app';
import CssHelper from '../../helpers/css_helper';
import MiscHelper from '../../helpers/misc_helper';
import MinusIcon from '../icons/minus_icon';
import PlusIcon from '../icons/plus_icon';

export const INCREMENT_AMOUNT = 'increment';
export const DECREMENT_AMOUNT = 'decrement';

export const MODE = Object.freeze({
    LARGER: 'larger',
    SMALLER: 'smaller'
});

const STATUS = Object.freeze({
    DEFAULT: 'default',
    LOADING: 'loading'
});

const AmountUpdater = inject('mobxStore')(observer(({ mobxStore, cartItem, amount, changeAmount, mode, style }) => {

    const [state, setState] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            sAmount: amount,
            oldAmount: amount,
            status: STATUS.DEFAULT
        }
    )

    const { sAmount, oldAmount, status } = state;

    useEffect(() => {
        if (_.isFunction(changeAmount))
            changeAmount(sAmount);

        if (status === STATUS.LOADING) {
            const id = cartItem.getId();
            UserCartDb.changeQuantity(id, sAmount).then((result) => {
                if (result) {
                    aa(sAmount, STATUS.DEFAULT);
                    mobxStore.cartStore.updateAmount(id, sAmount);
                }
            }, (error) => {
                MiscHelper.alertError();
                aa(oldAmount, STATUS.DEFAULT);
            });
        }
    }, [sAmount, status])

    const aa = (amount, status = null) => {
        let s = {
            amount
        };
        status !== null && (s.status = status);
        setState(s)
    }

    const _changeAmount = (mode) => {
        let sAmount = state.sAmount,
            oldAmount = sAmount;
        
        if (status === STATUS.LOADING || (sAmount === 1 && mode === DECREMENT_AMOUNT))
            return;
        switch(mode) {
            case INCREMENT_AMOUNT:
                sAmount ++;
                break;
            case DECREMENT_AMOUNT:
                sAmount --;
                break;
        }
        if (_.isObject(cartItem)) {
            setState({
                status: STATUS.LOADING,
                sAmount,
                oldAmount
            })
        } else {
            aa(sAmount)
        }
    }

    const iconSize = mode === MODE.SMALLER ? 8 : 12;

    return (
        <View style={[CssHelper['flexRowCentered'], styles.mAmountContainer, style]}>
            <View style={[styles.mIncrementer, mode === MODE.SMALLER && (styles.mIncrementerSmaller), sAmount === 1 && ({backgroundColor: '#fbfbfb'})]}>
                <TouchableOpacity style={styles.mIncrementerInner} activeOpacity={1} onPress={() => _changeAmount(DECREMENT_AMOUNT)}>
                    <MinusIcon width={iconSize} height={iconSize} color={sAmount > 1 ? "#666" : "#ccc"}/>
                </TouchableOpacity>
            </View>
            <View style={[styles.mIncrementAmount, mode === MODE.SMALLER && (styles.mIncrementAmountSmaller)]}>
                <View style={styles.mIncrementerInner}>
                    { status === STATUS.LOADING ? (
                        <ActivityIndicator size="small" color={APP_MAIN_COLOR}/>
                    ) : (
                        <Text style={[styles.mIncrementAmountText, mode === MODE.SMALLER && ({fontSize: 14})]}>
                            {sAmount}
                        </Text>
                    )}
                </View>
            </View>
            <View style={[styles.mIncrementer, mode === MODE.SMALLER && (styles.mIncrementerSmaller)]}>
                <TouchableOpacity style={styles.mIncrementerInner} activeOpacity={1} onPress={() => _changeAmount(INCREMENT_AMOUNT)}>
                    <PlusIcon width={iconSize} height={iconSize} color="#666666"/>
                </TouchableOpacity>
            </View>
        </View>
    );
}))

const styles = StyleSheet.create({
    mAmountContainer: {
        alignItems: "flex-end",
        justifyContent: 'flex-start'
    },
    mIncrementer: {
        backgroundColor: "#f2f2f2",
        width: 36,
        height: 36,
        borderRadius: 18
    },
    mIncrementerSmaller: {
        width: 28,
        height: 28,
        borderRadius: 14
    },
    mIncrementerInner: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    mIncrementAmount: {
        width: 40,
        height: 36,
    },
    mIncrementAmountSmaller: {
        width: 28,
        height: 28
    },
    mIncrementerInner: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    mIncrementAmountText: {
        color: "#2e9cc1",
        fontSize: 16
    }
});

AmountUpdater.propTypes = {
    cartItem: PropTypes.object,
    amount: PropTypes.number,
    changeAmount: PropTypes.func,
    mode: PropTypes.string,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
}

AmountUpdater.defaultProps = {
    amount: 1,
    mode: MODE.LARGER
}

export default AmountUpdater;