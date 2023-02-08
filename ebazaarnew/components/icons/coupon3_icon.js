import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G, Rect } from 'react-native-svg';

const Coupon3Icon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 512 512" fill={color}>
            <G>
                <G>
                    <Path d="M499.483,211.638l12.517-2.1V96H0v113.538l12.517,2.101C34.236,215.284,50,233.941,50,256s-15.764,40.716-37.483,44.362
                        L0,302.462V416h512V302.462l-12.517-2.101C477.764,296.716,462,278.059,462,256C462,233.941,477.764,215.284,499.483,211.638z
                        M482,326.735V386H372v-24.5h-30V386H30v-59.265C59.609,316.364,80,288.38,80,256s-20.391-60.364-50-70.735V126h312v24.5h30V126
                        h110v59.265c-29.609,10.371-50,38.354-50,70.735S452.391,316.364,482,326.735z"/>
                </G>
            </G>
            <G>
                <G>
                    <Rect x="342" y="271.5" width="30" height="60"/>
                </G>
            </G>
            <G>
                <G>
                    <Rect x="342" y="180.5" width="30" height="60"/>
                </G>
            </G>
        </Svg>
    );
});

Coupon3Icon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

Coupon3Icon.defaultProps = {
    color: "#000"
}

export default Coupon3Icon;