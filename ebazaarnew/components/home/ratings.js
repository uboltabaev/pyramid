import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Image, Animated } from 'react-native';
import _ from 'underscore';
import i18n from 'i18n-js';
import Ripple from 'react-native-material-ripple';
import {SCREEN_WIDTH} from "../../constants/app";
import CssHelper from "../../helpers/css_helper";
import ProgressText from '../ui/progress_text';

const PRODUCTS = {
    first: [
        {
            id: 1,
            name: 'Men\'s Watches',
            ru: 'Мужские часы',
            uz: 'Эркаклар соати',
            uz_latin: '',
            image_200x200: require('../../../assets/images/ratings/man-watch.jpg'),
            sold_num: 3225,
        },
        {
            id: 2,
            name: 'Women\'s Shoes',
            ru: 'Женская обувь',
            uz: 'Аёллар пойабзали',
            uz_latin: '',
            image_200x200: require('../../../assets/images/ratings/woman-shoes.jpg'),
            sold_num: 1914,
        },
        {
            id: 3,
            name: 'Bangles',
            ru: 'Браслеты',
            uz: 'Билагузуклар',
            uz_latin: '',
            image_200x200: require('../../../assets/images/ratings/bracelet.jpg'),
            sold_num: 563
        }
    ],
    second: [
        {
            id: 4,
            name: 'Jeans',
            ru: 'Джинсы',
            uz: 'Жинси',
            uz_latin: '',
            image_200x200: require('../../../assets/images/ratings/jeans.jpg'),
            sold_num: 725
        },
        {
            id: 6,
            name: 'Smart Watches',
            ru: 'Смарт-часы',
            uz: 'Смарт-соатлар',
            uz_latin: '',
            image_200x200: require('../../../assets/images/ratings/smartwatch.jpg'),
            sold_num: 978,
        },
        {
            id: 5,
            name: 'School Bags',
            ru: 'Школьные ранцы',
            uz: 'Мактаб сумкалари',
            image_200x200: require('../../../assets/images/ratings/school-backpack.jpg'),
            sold_num: 1302
        },
    ]
};

class Ratings extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            toggle: false,
            height: 0,
            initialized: {
                first: {
                    zIndex: 1
                },
                second: {
                    zIndex: 0
                }
            },            
            first: {
                translateY: new Animated.Value(0),
                imageOpacity: new Animated.Value(1),
                boxOpacity: new Animated.Value(1)
            },
            second: {
                translateY: new Animated.Value(0),
                imageOpacity: new Animated.Value(0),
                boxOpacity: new Animated.Value(0)
            }
        }
        this._onLayout = this._onLayout.bind(this);
        this.interval = null;
    }
    componentDidMount() {
        const {duration} = this.props;
        this.interval = setInterval(() => {
            this.setState({
                toggle: !this.state.toggle
            })
        }, duration);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    componentDidUpdate(prevProps, prevState) {
        const { toggle, height } = this.state;
        if (toggle !== prevState.toggle) {
            this.state.initialized.first.zIndex = toggle ? 0 : 1;
            this.state.initialized.second.zIndex = toggle ? 1 : 0;
            Animated.parallel([
                Animated.timing(this.state.first.translateY, {
                    toValue: toggle ? -(height / 2) : 0,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.first.imageOpacity, {
                    toValue: toggle ? 0 : 1,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.first.boxOpacity, {
                    toValue: toggle ? 0 : 1,
                    duration: toggle ? 1000 : 0,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.second.translateY, {
                    toValue: toggle ? 0 : -(height / 2),
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.second.imageOpacity, {
                    toValue: toggle ? 1 : 0,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.second.boxOpacity, {
                    toValue: toggle ? 1 : 0,
                    duration: toggle ? 0 : 1000,
                    useNativeDriver: true
                })
            ]).start(() => {
                if (toggle) {
                    this.state.first.translateY.setValue((height / 2));
                    this.state.initialized.first.zIndex = 1;
                } else {
                    this.state.second.translateY.setValue((height / 2));
                    this.state.initialized.second.zIndex = 1;
                }
            });    
        }
    }
    _onLayout(e) {
        const {height} = e.nativeEvent.layout;
        if (this.state.height === 0) {
            const halfHeight = height / 2;
            this.state.second.translateY.setValue(halfHeight);
            this.setState({
                height
            });
        }
    }
    render() {
        const {style} = this.props,
            locale = i18n.locale;
        return (            
            <View style={[styles.container, style]}>
                <View style={styles.header}>
                    <View style={[CssHelper['flexRowCentered'], styles.headerInner]}>
                        <View style={[CssHelper['flex']]}>
                            <Text style={styles.title}>
                                {i18n.t('ratings', {defaultValue: 'Рейтинги'})}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.imageContainer]}>
                    <Animated.View onLayout={this._onLayout} style={[CssHelper['flexRowCentered'], {position: 'absolute', zIndex: this.state.initialized.first.zIndex, opacity: this.state.first.boxOpacity, transform: [{translateY: this.state.first.translateY}]}]}>
                        { PRODUCTS.first.map((product, i) =>
                            <Ripple key={i} style={[styles.imageBox, {marginLeft: i ? 5 : 0}]}>
                                <Animated.View style={[CssHelper['flex'], {opacity: this.state.first.imageOpacity}]}>
                                    <View style={styles.a}>
                                        <Image source={product.image_200x200} style={styles.image} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.desc}>
                                        <ProgressText text={product.sold_num + ' ' + i18n.t('sold', {defaultValue: 'продано'})}/>
                                    </View>
                                    <Text style={styles.productTitle} numberOfLines={1}>
                                        {product[locale]}
                                    </Text>
                                </Animated.View>
                            </Ripple>
                        )}
                    </Animated.View>
                    <Animated.View style={[CssHelper['flexRowCentered'], {position: 'absolute', zIndex: this.state.initialized.second.zIndex, opacity: this.state.second.boxOpacity, transform: [{translateY: this.state.second.translateY}]}]}>
                        { PRODUCTS.second.map((product, i) =>
                            <Ripple key={i} style={[styles.imageBox, {marginLeft: i ? 5 : 0}]}>
                                <Animated.View style={[CssHelper['flex'], {opacity: this.state.second.imageOpacity}]}>
                                    <View style={styles.a}>
                                        <Image source={product.image_200x200} style={styles.image} resizeMode="contain"/>
                                    </View>
                                    <View style={styles.desc}>
                                        <ProgressText text={product.sold_num + ' ' + i18n.t('sold', {defaultValue: 'продано'})}/>
                                    </View>
                                    <Text style={styles.productTitle} numberOfLines={1}>
                                        {product[locale]}
                                    </Text>
                                </Animated.View>
                            </Ripple>
                        )}
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: 192,
        borderRadius: 5,
        padding: 5,
        paddingTop: 10
    },
    header: {
        height: 20,
    },
    innerHeader: {
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    title: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 14,
        paddingLeft: 5
    },
    a: {
        backgroundColor: '#fff'
    },
    imageContainer: {
        overflow: 'hidden',
        height: 152,
        marginTop: 5
    },
    imageBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    image: {
        width: (SCREEN_WIDTH - 50) / 3,
        height: (SCREEN_WIDTH - 50) / 3,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    productTitle: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
        paddingBottom: 4,
        paddingTop: 4
    },
    desc: {
        marginTop: 5
    },
});

Ratings.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    duration: PropTypes.number
}

Ratings.defaultProps = {
    duration: 6000
}

export default Ratings;