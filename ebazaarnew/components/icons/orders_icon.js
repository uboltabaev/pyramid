import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const OrdersIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 487.7 487.7" fill={color}>
            <G>
                <Path d="M80.2,62.7c-4.8-4.8-12.5-4.8-17.3-0.1C58,67.4,58,75.1,62.8,79.9L92,109.3c2.3,2.3,5.4,3.6,8.7,3.6l0,0
                    c3.2,0,6.3-1.3,8.6-3.6l88.9-88.4c4.8-4.8,4.8-12.5,0.1-17.3c-4.8-4.8-12.5-4.8-17.3,0l-26.9,26.7C139.8,15.5,119.9,7,99,7
                    C56.7,7,22.3,41.4,22.3,83.7s34.4,76.7,76.7,76.7c34.1,0,63.6-21.9,73.5-54.5c2-6.5-1.7-13.3-8.2-15.3c-6.5-1.9-13.3,1.7-15.3,8.2
                    c-6.6,21.8-27.2,37.1-50,37.1c-28.8,0-52.2-23.4-52.2-52.2S70.2,31.5,99,31.5c14.3,0,27.9,6,37.7,16.2l-35.9,35.7L80.2,62.7z"/>
                <Path d="M99,170.6c-42.3,0-76.7,34.4-76.7,76.7S56.7,324,99,324s76.7-34.4,76.7-76.7S141.3,170.6,99,170.6z M99,299.5
                    c-28.8,0-52.2-23.4-52.2-52.2s23.4-52.2,52.2-52.2s52.2,23.4,52.2,52.2S127.8,299.5,99,299.5z"/>
                <Path d="M175.7,411c0-42.3-34.4-76.7-76.7-76.7S22.3,368.7,22.3,411s34.4,76.7,76.7,76.7S175.7,453.3,175.7,411z M99,463.3
                    c-28.8,0-52.2-23.4-52.2-52.2s23.4-52.2,52.2-52.2s52.2,23.4,52.2,52.2S127.8,463.3,99,463.3z"/>
                <Path d="M453.1,235H214.8c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h238.3c6.8,0,12.3-5.5,12.3-12.3S459.9,235,453.1,235z"/>
                <Path d="M453.1,71.5H214.8c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h238.3c6.8,0,12.3-5.5,12.3-12.3S459.9,71.5,453.1,71.5z"
                    />
                <Path d="M453.1,398.8H214.8c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h238.3c6.8,0,12.3-5.5,12.3-12.3
                    C465.4,404.2,459.9,398.8,453.1,398.8z"/>
            </G>
        </Svg>
    );
});

OrdersIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

OrdersIcon.defaultProps = {
    color: "#000"
}

export default OrdersIcon;