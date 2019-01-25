import React, { Component } from 'react';

import ExampleContainer from '../ExampleContainer';
import { SelectList, SelectListItem } from '../../src/index';

export default class Example extends Component {
    state = {
        selectedId: 1
    };

    componentDidMount() {
        window.setTimeout(() => {
            this.setState({
                selectedId: 2
            });
        }, 1000);
    }

    render() {
        const elements = [];

        elements.push(<div className="selectitem__content">
            Intro
        </div>);

        elements.push(<div className="selectitem__content">
            test
        </div>);

        elements.push(<div className="selectitem__content">
                test2
            </div>);

        elements.push(null);

        return(
            <ExampleContainer headline="SelectList">
                <SelectList
                    selectFirst
                    // value={this.state.selectedId}
                    className="hello world"
                    onChange={(id, value) => {
                        console.log('change selectlist', { id, value });
                    }}
                >
                    {
                        elements.map((element, index) => {
                            if(!element) return null;

                            const others = {
                                disabled: index === 0
                            };

                            return (
                                <SelectListItem
                                    name="Hi"
                                    id={index}
                                    key={index}
                                    value={{ doubleIndex: index * 2 }}
                                    className="Hi"
                                    {...others}
                                >
                                    {element}
                                </SelectListItem>
                            );
                        })
                    }
                </SelectList>
            </ExampleContainer>
        );
    }
}
