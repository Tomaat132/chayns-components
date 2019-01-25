import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { ChooseButton, Icon, Input } from '../../index';

class TimeSpan extends Component {
    static propTypes = {
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        buttonType: PropTypes.number.isRequired,
        onAdd: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        disabled: false
    };

    static OFF = 0;

    static ADD = 1;

    static REMOVE = 2;

    static defaultStart = '08:00';

    static defaultEnd = '18:00';

    constructor(props) {
        super(props);
        this.startTime = createRef();
        this.endTime = createRef();

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const { buttonType, onAdd, onRemove } = this.props;
        if (buttonType === TimeSpan.ADD) onAdd(TimeSpan.defaultStart, TimeSpan.defaultEnd);
        if (buttonType === TimeSpan.REMOVE) onRemove();
    }

    onChange(_, valid) {
        const { onChange } = this.props;
        if (valid) {
            onChange(this.startTime.current.value, this.endTime.current.value);
        }
    }

    render() {
        const {
            start,
            end,
            disabled,
            buttonType
        } = this.props;

        return (
            <div className={`${disabled ? 'time--disabled' : 'time--active'} time__span`}>
                <div className="time__span--input">
                    <Input
                        inputRef={this.startTime}
                        value={disabled ? TimeSpan.defaultStart : start}
                        onChange={this.onChange}
                    />
                </div>
                <span>-</span>
                <div className="time__span--input">
                    <Input
                        inputRef={this.endTime}
                        value={disabled ? TimeSpan.defaultEnd : end}
                        onChange={this.onChange}
                    />
                </div>
                <div className="time__span--button">
                    {
                        buttonType !== TimeSpan.OFF && (
                            <ChooseButton
                                onClick={this.onClick}
                            >
                                <Icon icon={faPlus} className={`fa-xs openingTimesIcon ${buttonType === TimeSpan.ADD ? 'add' : 'remove'}`}/>
                            </ChooseButton>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default TimeSpan;
