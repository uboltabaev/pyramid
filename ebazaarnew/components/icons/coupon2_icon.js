import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const Coupon2Icon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 512 512" fill={color}>
            <G>
                <G>
                    <Path d="M501.333,202.667c5.888,0,10.667-4.779,10.667-10.667v-85.333C512,100.779,507.221,96,501.333,96H10.667
                        C4.779,96,0,100.779,0,106.667V192c0,5.888,4.779,10.667,10.667,10.667C40.085,202.667,64,226.603,64,256
                        s-23.915,53.333-53.333,53.333C4.779,309.333,0,314.112,0,320v85.333C0,411.221,4.779,416,10.667,416h490.667
                        c5.888,0,10.667-4.779,10.667-10.667V320c0-5.888-4.779-10.667-10.667-10.667C471.915,309.333,448,285.397,448,256
                        S471.915,202.667,501.333,202.667z M426.667,256c0,37.547,27.861,68.715,64,73.899v64.768H21.333v-64.768
                        c36.139-5.184,64-36.352,64-73.899s-27.861-68.715-64-73.899v-64.768h469.333v64.768C454.528,187.285,426.667,218.453,426.667,256
                        z"/>
                </G>
            </G>
            <G>
                <G>
                    <Path d="M138.667,224c-5.888,0-10.667,4.779-10.667,10.667v42.667c0,5.888,4.779,10.667,10.667,10.667s10.667-4.779,10.667-10.667
                        v-42.667C149.333,228.779,144.555,224,138.667,224z"/>
                </G>
            </G>
            <G>
                <G>
                    <Path d="M138.667,138.667c-5.888,0-10.667,4.779-10.667,10.667V192c0,5.888,4.779,10.667,10.667,10.667
                        s10.667-4.779,10.667-10.667v-42.667C149.333,143.445,144.555,138.667,138.667,138.667z"/>
                </G>
            </G>
            <G>
                <G>
                    <Path d="M138.667,309.333c-5.888,0-10.667,4.779-10.667,10.667v42.667c0,5.888,4.779,10.667,10.667,10.667
                        s10.667-4.779,10.667-10.667V320C149.333,314.112,144.555,309.333,138.667,309.333z"/>
                </G>
            </G>
        </Svg>
    );
});

Coupon2Icon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

Coupon2Icon.defaultProps = {
    color: "#000"
}

export default Coupon2Icon;