import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const ShoppingBagIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 1000 1000" fill={color}>
            <G>
                <Path d="M945.5,962.2l-40.5-635c-1.2-10.8-10.3-19-21.2-19h-170v-85.1C713.9,105.4,618.5,10,500.8,10s-213.1,95.4-213.1,213.1v85.1H118.8c-10.8,0-20,8.1-21.2,18.9l-44,639.2c-0.7,6,1.2,12.1,5.3,16.6c4,4.5,9.8,7.1,15.9,7.1h850c0.2,0,0.3,0,0.4,0c11.8,0,21.3-9.6,21.3-21.3C946.5,966.4,946.2,964.2,945.5,962.2z M330.3,223.1c0-94.1,76.3-170.5,170.5-170.5c94.1,0,170.5,76.3,170.5,170.5v85.1H330.3V223.1z M98.6,947.4l39.2-596.6h149.9v48.4c-12.7,7.4-21.3,21.1-21.3,36.9c0,23.5,19.1,42.6,42.6,42.6c23.5,0,42.6-19.1,42.6-42.6c0-15.8-8.6-29.5-21.3-36.9v-48.4h340.9v48.4c-12.7,7.4-21.3,21.1-21.3,36.9c0,23.5,19.1,42.6,42.6,42.6c23.5,0,42.6-19.1,42.6-42.6c0-15.8-8.6-29.5-21.3-36.9v-48.4h150.9L901,947.4H98.6L98.6,947.4z"/>
            </G>
        </Svg>
    )
})

ShoppingBagIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

ShoppingBagIcon.defaultProps = {
    color: "#000"
}

export default ShoppingBagIcon;