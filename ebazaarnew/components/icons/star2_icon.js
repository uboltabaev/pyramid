import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G } from 'react-native-svg';

const Star2Icon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 443.442 443.442" fill={color}>
            <G>
                <Path d="M436.083,190.376l-115.52,83.927l44.13,135.801c2.388,7.353-0.236,15.403-6.479,19.954
                    c-3.139,2.271-6.81,3.405-10.498,3.405c-3.682,0-7.364-1.135-10.479-3.405l-115.514-83.933l-115.508,83.921
                    c-6.266,4.552-14.733,4.552-20.986,0c-6.239-4.539-8.866-12.59-6.475-19.942l44.118-135.807L7.364,190.376
                    c-6.254-4.545-8.881-12.593-6.49-19.948c2.397-7.354,9.256-12.33,16.979-12.33h142.78l44.118-135.791
                    c2.391-7.353,9.245-12.327,16.979-12.327s14.576,4.974,16.964,12.327l44.118,135.791h142.792c7.72,0,14.576,4.977,16.976,12.33
                    C444.95,177.783,442.32,185.831,436.083,190.376z"/>
            </G>
        </Svg>
    )
})

Star2Icon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

Star2Icon.defaultProps = {
    color: "#000"
}

export default Star2Icon;