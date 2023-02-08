import React from 'react';
import { View, Text } from 'react-native';
import _ from 'underscore';
import i18n from 'i18n-js';
import CssHelper from "../../helpers/css_helper";
import DateHelper from "../../helpers/date_helper";
import MiscHelper from '../../helpers/misc_helper';
import CouponBox from '../ui/coupon_box';

const COUPON_DATA = {
    coupon_amount: 2000,
    buy_amount: 200000,
    start_date: '2020-01-01',
    end_date: '2020-03-01'
};

const NewUserCoupon = React.memo(() => {
    const dateHelper = new DateHelper(i18n.locale);

    const onClick = () => {
        //console.log('123')
    }

    const makeCouponData = (couponData) => {
        const buy_amount = MiscHelper.price(couponData['buy_amount']);
        return {
            title: MiscHelper.price(couponData['coupon_amount']),
            desc: i18n.t('new_user_coupon_text', {defaultValue: "На заказ от " + buy_amount, amount: buy_amount}),
            date: dateHelper.getDateShort(couponData.start_date) + " " + dateHelper.getDateShort(couponData.end_date)
        }
    }

    const couponData = makeCouponData(COUPON_DATA);

    return (
        <View style={CssHelper['couponContainer']}>
            <View style={CssHelper['couponInnerContainer']}>
                <Text style={CssHelper['productSectionTitle']}>
                    {i18n.t('new_user_coupon', {defaultValue: 'Купон нового пользователя'})}
                </Text>
                <CouponBox title={couponData['title']} 
                    desc={couponData['desc']} 
                    date={couponData['date']} 
                    onClick={onClick}
                />
            </View>
        </View>
    )
})

export default NewUserCoupon;