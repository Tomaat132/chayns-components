/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChooseButton from '../../react-chayns-button/component/ChooseButton';

export default class SelectButton extends Component {
    static propTypes = {
        onSelect: PropTypes.func,
        title: PropTypes.string,
        description: PropTypes.string,
        disabled: PropTypes.bool,
        label: PropTypes.string,
        list: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
        listKey: PropTypes.string,
        listValue: PropTypes.string,
        multiSelect: PropTypes.bool,
        quickFind: PropTypes.bool,
        className: PropTypes.string,
        showSelection: PropTypes.bool,
        selectedFlag: PropTypes.string,
    };

    static defaultProps = {
        quickFind: false,
        multiSelect: false,
        title: '',
        description: '',
        label: 'Select',
        showSelection: true,
        className: null,
        onSelect: null,
        disabled: false,
        listKey: 'name',
        listValue: 'value',
        selectedFlag: 'isSelected',
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: props.list.filter(item => item[props.selectedFlag]),
        };

        this.onClick = this.onClick.bind(this);
        this.getDialogList = this.getDialogList.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {
            list, listKey, listValue, selectedFlag
        } = this.props;
        if (list !== nextProps.list || listKey !== nextProps.listKey || listValue !== nextProps.listValue || selectedFlag !== nextProps.selectedFlag) {
            this.setState({ selected: nextProps.list.filter(item => item[nextProps.selectedFlag]) });
        }
    }

    onClick() {
        const {
            quickFind,
            multiSelect,
            title,
            description,
            list,
            onSelect,
        } = this.props;
        const _list = this.getDialogList(list);

        chayns.dialog.select({
            title,
            message: description,
            quickfind: quickFind,
            multiselect: multiSelect,
            list: _list
        }).then((result) => {
            if (onSelect && result.buttonType > 0) {
                onSelect(this.getReturnList(result));
            }
        }).catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e);
        });
    }

    getDialogList(_list) {
        const { selected } = this.state;
        const { showSelection, listKey, listValue } = this.props;
        const list = [];

        if (_list) {
            _list.map((item, i) => {
                const curListKey = listKey || i;
                if (item[curListKey] && item[listValue]) {
                    list.push({
                        name: item[listValue],
                        value: item[curListKey],
                        isSelected: selected.indexOf(item) >= 0 && showSelection
                    });
                }
            });
        }

        return list;
    }

    getReturnList(selected) {
        const { list, listKey } = this.props;
        const { buttonType, selection: selectedItems } = selected;
        const result = [];

        selectedItems.map((item) => {
            list.map((listItem) => {
                if (listItem[listKey] === item.value) result.push(listItem);
            });
        });
        this.setState({ selected: result });
        return { buttonType, selection: result };
    }

    render() {
        const {
            className, label, disabled, listValue
        } = this.props;
        const { selected } = this.state;
        return (
            <ChooseButton
                className={className}
                disabled={disabled}
                onClick={this.onClick}
            >
                {selected && selected.length > 0 ? selected.map((item, index) => {
                    let str = (index === 1) ? ', ' : '';
                    str += (index < 2) ? item[listValue] : '';
                    str += (index === 2) ? '...' : '';
                    return str;
                }) : label}
            </ChooseButton>
        );
    }
}
