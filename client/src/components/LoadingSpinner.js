import React from 'react';

export default function LoadingSpinner(props) {
    return (
        <svg
            className="spinner"
            width={`${props.size}px`}
            height={`${props.size}px`}
            viewBox={`0 0 ${props.size + 1} ${props.size + 1}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                className="spinner__path"
                fill="none"
                strokeWidth={props.strokeWidth}
                strokeLinecap="round"
                cx={Math.ceil(props.size / 2)}
                cy={Math.ceil(props.size / 2)}
                r={Math.floor(props.size / 2) - Math.floor(props.size / 20)}
            />
        </svg>
    );
}

LoadingSpinner.propTypes = {
    size: React.PropTypes.number,
    strokeWidth: React.PropTypes.number
};

LoadingSpinner.defaultProps = {
    size: 65,
    strokeWidth: 6
};
