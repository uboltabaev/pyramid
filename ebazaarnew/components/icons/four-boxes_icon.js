import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const FourBoxesIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 174.239 174.239" fill={color}>
            <G>
                <G>
                    <Path d="M174.239,174.239H96.945V96.945h77.294V174.239z M111.88,159.305h47.425V111.88H111.88V159.305z"/>
                </G>
                <G>
                    <Path d="M77.294,174.239H0V96.945h77.294V174.239z M14.935,159.305H62.36V111.88H14.935V159.305z"/>
                </G>
                <G>
                    <Path d="M174.239,77.294H96.945V0h77.294V77.294z M111.88,62.36h47.425V14.935H111.88V62.36z"/>
                </G>
                <G>
                    <Path d="M77.294,77.294H0V0h77.294V77.294z M14.935,62.36H62.36V14.935H14.935V62.36z"/>
                </G>
            </G>
        </Svg>
    )
})

FourBoxesIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

FourBoxesIcon.defaultProps = {
    color: "#000"
}

export default FourBoxesIcon;