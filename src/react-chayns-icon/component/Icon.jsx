import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Icon extends PureComponent {
    static propTypes = {
        icon: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.shape({
                iconName: PropTypes.string.isRequired,
                prefix: PropTypes.string.isRequired,
            }).isRequired,
        ]).isRequired,
        className: PropTypes.string,
        style: PropTypes.object(),
        onClick: PropTypes.func,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        className: '',
        style: undefined,
        onClick: undefined,
        disabled: false
    };

    constructor(props) {
        super(props);
        const { icon } = props;
        if (!chayns.utils.isString(icon) && icon && icon.prefix && icon.iconName) {
            library.add(icon);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { icon } = this.props;
        if (icon !== nextProps.icon && !chayns.utils.isString(nextProps.icon) && nextProps.icon && nextProps.icon.prefix && nextProps.icon.iconName) {
            library.add(nextProps.icon);
        }
    }

    render() {
        const {
            icon, className, onClick, disabled, ...rest
        } = this.props;

        if (chayns.utils.isString(icon)) {
            const classes = classNames(`react-chayns-icon ${icon}`, {
                [className]: !!className,
                'react-chayns-icon--clickable': typeof onClick === 'function',
                'react-chayns-icon--disabled': disabled === true
            });
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            return <i className={classes} onClick={disabled !== true && typeof onClick === 'function' ? onClick : () => {}} {...rest}/>;
        }
        if (!icon) {
            return null;
        }
        if (typeof onClick === 'function') {
            return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <span className={`react-chayns-icon react-chayns-icon--clickable${disabled === true ? ' react-chayns-icon--disabled' : ''}`} onClick={disabled !== true ? onClick : () => {}}>
                    <FontAwesomeIcon icon={[icon.prefix, icon.iconName]} className={className} {...rest}/>
                </span>
            );
        }
        return <FontAwesomeIcon icon={[icon.prefix, icon.iconName]} className={className} {...rest}/>;
    }
}
