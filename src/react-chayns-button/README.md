# Button / ChooseButton #

The Button/ChooseButton is part of the *chayns-components* package. It can be installed via npm:

    npm install -S chayns-components@latest


## Usage ##

At least one of the components has to be imported:

```jsx harmony
import { Button, ChooseButton } from 'chayns-components';
```

You can use the button like this:

```jsx harmony
<Button>Test</Button>
```


## Props ##

The following properties can be set on the Button and the ChooseButton-Component

| Property     | Description                                                                          | Type          | Default Value                        |
|--------------|--------------------------------------------------------------------------------------|---------------|--------------------------------------|
| children     | Value of the button                                                                  | string        | *required*                           |
| chooseButton | Render Button as ChooseButton (not necessary when using the ChooseButton-component)  | bool          | false (Button) / true (ChooseButton) |
| disabled     | Disabled the button and set the correct style                                        | bool          | false                                |
| secondary    | Renders Button as a secondary button                                                 | bool          | false                                |
| onClick      | onClick-event                                                                        | function      |                                      |
| className    | Additional CSS-Classes that should be set to the button                              | string        |                                      |
| style        | Additional styles that should be set to the button                                   | Object        |                                      |
| buttonRef    | Exposes the button DOM Ref to the parent component                                   | func          |                                      |
| icon         | Renders Button as IconButton (fa- or ts-icon)                                        | string/object |                                      |


## Example ##

You can take a look at the **examples** folder in the **react-chayns-button** repository. There you can find an appropriate way of implementing the **Button** to your chayns-Tapp.
