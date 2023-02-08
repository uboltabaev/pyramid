import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, Line, Text, Image } from 'react-native-svg';

export const BUTTON_DISABLED_MODE = Object.freeze({
    TEXT: 'text',
    IMAGE: 'image'
});

const ROUND = 3;
const STROKE_WIDTH = 1;

const ButtonDisabled = React.memo(({ width, height, mode, text, imageSource }) => {
    const s = STROKE_WIDTH / 2,
        over = 2 * ROUND + STROKE_WIDTH,
        w = width - over,
        h = height - over - 0.20,
        d = `
            M${ROUND + s},${s}
            h${w}
            a${ROUND},${ROUND} 0 0 1 ${ROUND},${ROUND}
            v${h}
            a${ROUND},${ROUND} 0 0 1 -${ROUND},${ROUND}
            h-${w}
            a${ROUND},${ROUND} 0 0 1 -${ROUND},-${ROUND}
            v-${h}
            a${ROUND},${ROUND} 0 0 1 ${ROUND},-${ROUND}
            z
        `;
    return (
        <Svg width={width} height={height}>
            <Path d={d} fill="#fafafa" stroke="#e5e5e5" strokeWidth={STROKE_WIDTH}/>
            { mode === BUTTON_DISABLED_MODE.TEXT &&
                <Text stroke="none"
                    fill="#b0b1b6"
                    fontSize="14"
                    x={width / 2}
                    y={height / 2 + 5}
                    textAnchor="middle"
                >
                    {text}
                </Text>
            }
            { mode === BUTTON_DISABLED_MODE.IMAGE &&
                <Image x={2}
                    y={2}
                    width={width - 4}
                    height={height - 4}
                    opacity="0.5"
                    href={imageSource}
                />
            }
            <Line x1="0.5" y1="0.5" x2={width - 0.5} y2={height - 0.5} stroke="#e5e5e5" strokeWidth="1"/>
        </Svg>
    )
})

ButtonDisabled.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    mode: PropTypes.string,
    text: PropTypes.string
}

ButtonDisabled.defaultProps = {
    width: 50,
    height: 50,
    mode: BUTTON_DISABLED_MODE.TEXT,
    text: ''
}

export default ButtonDisabled;