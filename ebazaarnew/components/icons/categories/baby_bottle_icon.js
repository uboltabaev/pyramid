import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

const BabyBottleIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="-136 0 512 512" fill={color}>
            <Path d="m0 462c0 27.570312 22.429688 50 50 50h140c27.570312 0 50-22.429688 50-50v-232c0-19.9375-11.730469-37.179688-28.648438-45.199219 5.40625-6.824219 8.648438-15.4375 8.648438-24.800781 0-14.457031-7.8125-27.605469-20.011719-34.644531.007813-2.757813.011719-5.304688.011719-5.355469 0-18.539062-12.203125-28.566406-22.972656-37.414062-13.289063-10.917969-27.027344-22.207032-27.027344-52.234376v-.351562c0-16.542969-13.457031-30-30-30s-30 13.457031-30 30c0 30.371094-13.890625 41.921875-27.320312 53.089844-10.628907 8.839844-22.679688 18.859375-22.679688 36.910156 0 .050781.003906 2.597656.011719 5.359375-12.207031 7.046875-20.011719 20.191406-20.011719 34.640625 0 9.363281 3.242188 17.976562 8.648438 24.800781-16.917969 8.019531-28.648438 25.261719-28.648438 45.199219v73c0 5.523438 4.476562 10 10 10s10-4.476562 10-10v-73c0-16.542969 13.457031-30 30-30h140c16.542969 0 30 13.457031 30 30v16h-50c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h50v40h-50c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h50v40h-50c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h50v40h-50c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h50v16c0 16.542969-13.457031 30-30 30h-140c-16.542969 0-30-13.457031-30-30v-79c0-5.523438-4.476562-10-10-10s-10 4.476562-10 10zm75.464844-363.53125c14.574218-12.121094 34.535156-28.71875 34.535156-68.46875 0-5.515625 4.484375-10 10-10s10 4.484375 10 10v.351562c0 39.480469 19.84375 55.785157 34.328125 67.6875 10.300781 8.460938 15.671875 13.277344 15.671875 21.960938h-120c0-8.285156 5.304688-13.082031 15.464844-21.53125zm-15.464844 41.53125h120c11.054688 0 20 8.988281 20 20 0 11.027344-8.972656 20-20 20h-120c-11.027344 0-20-8.972656-20-20 0-11.023438 8.964844-20 20-20zm0 0"/>
            <Path d="m10 353c5.519531 0 10-4.480469 10-10s-4.480469-10-10-10-10 4.480469-10 10 4.480469 10 10 10zm0 0"/>
        </Svg>
    )
})

BabyBottleIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

BabyBottleIcon.defaultProps = {
    color: "#000"
}

export default BabyBottleIcon;