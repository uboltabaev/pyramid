import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const ArrowRightIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 98.148 98.148" fill={color}>
            <G>
                <Path d="M33.458,97.562L80.531,50.49c0.75-0.75,0.75-2.078,0-2.828L33.456,0.586C33.081,0.211,32.572,0,32.042,0
                    c-0.53,0-1.039,0.211-1.414,0.586L17.641,13.573c-0.391,0.391-0.586,0.902-0.586,1.414c0,0.512,0.195,1.023,0.586,1.414
                    l32.674,32.674L17.642,81.75c-0.751,0.75-0.75,2.078,0,2.828l12.987,12.984C31.411,98.344,32.677,98.344,33.458,97.562z"/>
            </G>
        </Svg>
    )
})

ArrowRightIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

ArrowRightIcon.defaultProps = {
    color: "#000"
}

export default ArrowRightIcon;