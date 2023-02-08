import React, { useState } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import _ from 'underscore';
import { STATUS_BAR_HEIGHT } from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import DateHelper from "../../helpers/date_helper";
import MiscHelper from '../../helpers/misc_helper';
import Modal from "../ui/modal";
import MiniCouponBox from "../ui/mini_coupon_box";
import CouponBox, { THEME_COUPON_BOX_SELLER, SELLER_COUPON_BOX_HEIGHT } from '../ui/coupon_box';

const SELLERS_COUPONS = [
    {
        discount_amount: 28500,
        buy_amount: 847000,
        start_date: '2019-12-01',
        end_date: '2020-01-01'
    },
    {
        discount_amount: 19049,
        buy_amount: 466694,
        start_date: '2020-01-01',
        end_date: '2020-02-01'
    }
];

const SellerCoupon = React.memo(() => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    const toggleModal = () => {
        setIsModalVisible(v => !v);
    }

    const makeMiniCouponText = () => {
        const amount = MiscHelper.price(28500);
        return i18n.t('cheaper_with_coupon', {defaultValue: "На " + amount + " дешевле с купоном", amount});
    }

    const makeCouponData = (couponData) => {
        const amount = MiscHelper.price(couponData['buy_amount']),
            dateHelper = new DateHelper(i18n.locale);
        return {
            title: MiscHelper.price(couponData['discount_amount']),
            desc: i18n.t('spend&get', {defaultValue: "Потрать " + amount + ", получи скидку " + couponData['discount_amount'] + " (без доставки)", amount, discount: couponData['discount_amount']}),
            date: dateHelper.getDateShort(couponData.start_date) + " " + dateHelper.getDateShort(couponData.end_date)
        };
    }

    const text = makeMiniCouponText(),
        modalTitle = i18n.t('coupons@discounts', {defaultValue: "Купоны и скидки"});

    return (
        <Ripple rippleFades={false} rippleOpacity={0.08} onPress={toggleModal} rippleDuration={300}>
            <View style={[CssHelper['couponContainer']]}>
                <View style={[CssHelper['couponInnerContainer'], styles.container]}>
                    <View style={styles.L}>
                        <Text style={CssHelper['productSectionTitle']}>
                            {i18n.t('coupons@discounts', {defaultValue: "Купоны и скидки"})}
                        </Text>
                        <View style={styles.inner}>
                            <MiniCouponBox text={text}/>
                        </View>
                    </View>
                    <View style={styles.R}>
                        <View style={styles.innerR}>
                            <Text style={CssHelper['link']}>
                                {i18n.t('get', {defaultValue: "Получить"})}
                            </Text>
                        </View>
                        <Modal isVisible={isModalVisible} 
                            closeModal={toggleModal} 
                            marginTop={(80 - STATUS_BAR_HEIGHT)} 
                            title={modalTitle}
                            animationInTiming={450}
                            animationOutTiming={450}
                        >
                            <Text style={styles.title}>
                                {i18n.t('seller_coupon', {defaultValue: "Купон продавца"})}
                            </Text>
                            <View>
                                { SELLERS_COUPONS.map((coupon, index) => {
                                    const couponData = makeCouponData(coupon);
                                    return (
                                        <View key={index} style={styles.couponContainer}>
                                            <CouponBox theme={THEME_COUPON_BOX_SELLER} 
                                                title={couponData.title} 
                                                desc={couponData.desc} 
                                                date={couponData.date}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                        </Modal>
                    </View>
                </View>
            </View>
        </Ripple>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    L: {
        flex: 1
    },
    R: {
        width: 95,
    },
    innerR: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    title: {
        color: "#999",
        paddingBottom: 10
    },
    couponContainer: {
        height: SELLER_COUPON_BOX_HEIGHT, 
        marginBottom: 10
    }
});

export default SellerCoupon;