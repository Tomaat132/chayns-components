/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Groups extends Component {

    static propTypes = {
        groups: PropTypes.array,
        onClick: PropTypes.func,
        focus: PropTypes.number
    };

    constructor(){
        super();
    }
    render(){
        return(
            <div className="calendar__groups">
                {
                    this.props.groups.map((group)=>{
                        let className = classNames('calendar__groups_item',{
                            'calendar__groups_notFocused': this.props.focus && group.id!=this.props.focus
                        });
                        return (
                            <div className={className} key={group.id} onClick={(event)=>this.props.onClick(event,group)}>
                                <div className="calendar__groups_color" style={{backgroundColor: group.color ? group.color : chayns.env.site.color}}></div>
                                {group.name}
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}