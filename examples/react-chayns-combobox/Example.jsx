import React, { PureComponent } from 'react';

import { ComboBox } from '../../src/index';
import ExampleContainer from '../ExampleContainer';

export default class Example extends PureComponent {
    render() {
        const pizza = [
            {
                id: '0',
                name: 'Margherita',
                price: '4.00'
            }, {
                id: '1',
                name: 'Salami',
                price: '4.50'
            }, {
                id: '2',
                name: 'Prosciutto',
                price: '4.50'
            }, {
                id: '3',
                name: 'Funghi',
                price: '5.00'
            }
        ];

        return(
            <ExampleContainer headline="ComboBox">
                <div style={{ marginBottom: '20px' }}>
                <ComboBox
                    label="Select Pizza"
                    list={pizza}
                    onSelect={(value) => { console.log(value); }}
                    listKey="id"
                    listValue="name"
                    htmlSelect
                />
                </div>
                <ComboBox
                    label="Select Pizza"
                    list={pizza}
                    onSelect={(value) => { console.log(value); }}
                    listKey="id"
                    listValue="name"
                    htmlSelect
                    disabled
                />
            </ExampleContainer>
        );
    }
}
