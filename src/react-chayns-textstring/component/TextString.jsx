import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import isTobitEmployee from '../../utils/tobitEmployee';
import getTappWidth from '../../utils/tappWidth';

export default class TextString extends Component {
    static propTypes = {
        stringName: PropTypes.string,
        replacements: PropTypes.objectOf(PropTypes.string),
        children: PropTypes.node.isRequired,
        useDangerouslySetInnerHTML: PropTypes.bool,
        language: PropTypes.string,
        fallback: PropTypes.string,
        setProps: PropTypes.arrayOf(PropTypes.object),
        preventNoTranslate: PropTypes.bool,
    };

    static defaultProps = {
        stringName: null,
        replacements: [],
        useDangerouslySetInnerHTML: false,
        language: null,
        fallback: '',
        setProps: {},
        preventNoTranslate: false,
    };

    static textStrings = {};

    static language = (chayns.env.language || navigator.language || 'de').substring(0, 2)
        .toLowerCase();

    static getTextString(stringName, language) {
        const lang = TextString.languages.find(l => l.code === (language || TextString.language)).value;
        const { textStrings } = TextString;
        const strings = textStrings[lang] || textStrings[Object.keys(textStrings)[0]];
        const result = Object.keys(strings)
            .map((lib) => {
                return strings[lib][stringName] || null;
            })
            .filter(x => x !== null)[0];
        return result;
    }

    static loadLibrary(projectName, middle = 'langRes', language) {
        return new Promise((resolve, reject) => {
            const lang = TextString.languages.find(l => l.code === (language || TextString.language)).value;
            if (!(TextString.textStrings[lang] && TextString.textStrings[lang][projectName])) {
                fetch(`https://chayns-res.tobit.com/LangStrings/${projectName}/${projectName}${middle}_${lang}.json`)
                    .then((response) => {
                        if (response.status === 200) {
                            response.json()
                                .then((json) => {
                                    TextString.textStrings[lang] = { [projectName]: { ...json, ...{ middle } } };
                                    if (window.debugLevel >= 3) {
                                        // eslint-disable-next-line no-console
                                        console.debug('TextString Storage', TextString.textStrings);
                                    }
                                    resolve();
                                })
                                .catch((e) => {
                                    reject(e);
                                });
                        } else {
                            reject(response.statusText);
                        }
                    })
                    .catch((e) => {
                        reject(e);
                    });
            } else {
                resolve();
            }
        });
    }

    static changeTextString(stringName, text, language) {
        return new Promise((resolve, reject) => {
            fetch('https://chayns1.tobit.com/TappApi/LangRes/TextString', {
                mode: 'cors',
                method: 'post',
                headers: {
                    Accept: 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `StringName=${stringName}&Text=${encodeURIComponent(text)}&Language=${language}`
            })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(response.json());
                    } else {
                        reject(response.statusText);
                    }
                }, reject);
        });
    }

    static setLanguage(language) {
        TextString.language = language.substring(0, 2)
            .toLowerCase();
    }

    static languages = [{
        name: 'Deutsch',
        value: 'Ger',
        code: 'de',
    }, {
        name: 'Englisch',
        value: 'Eng',
        code: 'en',
    }, {
        name: 'Französisch',
        value: 'Fra',
        code: 'fr',
    }, {
        name: 'Niederländisch',
        value: 'Ned',
        code: 'nl',
    }, {
        name: 'Italienisch',
        value: 'Ita',
        code: 'it',
    }, {
        name: 'Portugiesisch',
        value: 'Pt',
        code: 'pt',
    }, {
        name: 'Spanisch',
        value: 'Es',
        code: 'es',
    }, {
        name: 'Türkisch',
        value: 'Tr',
        code: 'tr',
    }];

    constructor() {
        super();
        this.state = {
            textString: null,
            textStringProps: {}
        };
        this.childrenOnClick = this.childrenOnClick.bind(this);
        this.replace = this.replace.bind(this);
        this.changeStringDialog = this.changeStringDialog.bind(this);
        this.changeStringResult = this.changeStringResult.bind(this);
        this.selectStringToChange = this.selectStringToChange.bind(this);
        this.setTextStrings = this.setTextStrings.bind(this);
        this.selectLanguageToChange = this.selectLanguageToChange.bind(this);
    }

    componentDidMount() {
        this.setTextStrings();
    }

    componentWillReceiveProps(nextProps) {
        const { replacements, stringName } = this.props;
        if (replacements !== nextProps.replacements || stringName !== nextProps.stringName) {
            this.setTextStrings();
        }
    }

    setTextStrings() {
        const {
            stringName, language, fallback, setProps
        } = this.props;
        let string = TextString.getTextString(stringName, language);
        if (string) {
            this.setState({ textString: this.replace(string) });
        } else {
            this.setState({ textString: this.replace(fallback) });
        }
        Object.keys(setProps)
            .forEach((prop) => {
                if (prop !== 'fallback') {
                    string = TextString.getTextString(setProps[prop]);
                    if (string) {
                        const { textStringProps } = this.state;
                        this.setState({ textStringProps: { ...textStringProps, ...{ [prop]: this.replace(string) } } });
                    } else if (setProps.fallback && setProps.fallback[prop]) {
                        const { textStringProps } = this.state;
                        this.setState({ textStringProps: { ...textStringProps, ...{ [prop]: this.replace(setProps.fallback[prop]) } } });
                    }
                }
            });
    }

    replace(text) {
        const { replacements } = this.props;

        let textString = text;
        Object.keys(replacements)
            .forEach((replacement) => {
                textString = textString.replace(replacement, replacements[replacement]);
            });
        return textString;
    }

    childrenOnClick(e) {
        if (e.ctrlKey) {
            isTobitEmployee()
                .then(this.selectStringToChange)
                .catch(() => {
                });
        }
    }

    selectStringToChange() {
        const { stringName, setProps } = this.props;

        if (Object.keys(setProps).length > 1) {
            const stringList = [];
            if (stringName) {
                stringList.push({
                    name: `children: ${stringName}`,
                    value: stringName
                });
            }
            Object.keys(setProps)
                .forEach((key) => {
                    if (key !== 'fallback') {
                        stringList.push({
                            name: `${key}: ${setProps[key]}`,
                            value: setProps[key]
                        });
                    }
                });
            chayns.dialog.select({
                title: 'TextString wählen',
                message: 'Wähle den TextString, den du ändern möchtest:',
                quickfind: 0,
                multiselect: 0,
                list: stringList
            })
                .then((data) => {
                    if (data.buttonType === 1 && data.selection && data.selection.length > 0) {
                        this.selectLanguageToChange(data.selection[0].value);
                    }
                });
        } else {
            this.selectLanguageToChange(stringName);
        }
    }

    selectLanguageToChange(stringName) {
        const { language } = this.props;
        chayns.dialog.select({
            title: `TextString bearbeiten: ${stringName}`,
            message: `Wähle die Sprache: (angezeigt wird ${TextString.languages.find(l => l.code === (language || TextString.language)).name})`,
            quickfind: 0,
            multiselect: 0,
            list: TextString.languages
        })
            .then((data) => {
                if (data.buttonType === 1 && data.selection && data.selection.length > 0) {
                    const lang = data.selection[0];
                    if (lang.value === TextString.languages.find(l => l.code === (language || TextString.language)).value) { // language is already selected
                        this.changeStringDialog(stringName, lang);
                    } else {
                        // Get lib
                        let library = null;
                        let middle = 'langRes';
                        const globalLang = TextString.languages.find(l => l.code === TextString.language).value;
                        Object.keys(TextString.textStrings[globalLang])
                            .forEach((lib) => {
                                if (TextString.textStrings[globalLang][lib][stringName]) {
                                    library = lib;
                                    // eslint-disable-next-line prefer-destructuring
                                    middle = TextString.textStrings[globalLang][lib].middle;
                                }
                            });
                        TextString.loadLibrary(library, middle, TextString.languages.find(l => l.value === lang.value).code)
                            .then(() => {
                                this.changeStringDialog(stringName, lang);
                            });
                    }
                }
            });
    }

    changeStringDialog(stringName, lang) {
        const { useDangerouslySetInnerHTML } = this.props;
        const string = TextString.getTextString(stringName, TextString.languages.find(l => l.value === lang.value).code);
        if (string) {
            if (useDangerouslySetInnerHTML) {
                chayns.register({ apiDialogs: true });
                chayns.dialog.iFrame({
                    width: getTappWidth() + 76,
                    url: 'https://frontend.tobit.com/dialog-html-editor/v1.0/',
                    input: string,
                    title: stringName,
                    message: `Sprache: ${lang.name}`,
                    buttons: [{
                        text: 'Speichern',
                        buttonType: 1
                    }, {
                        text: 'Abbrechen',
                        buttonType: -1
                    }]
                })
                    .then((result) => {
                        this.changeStringResult(result, lang);
                    });
            } else {
                chayns.dialog.input({
                    title: stringName,
                    message: `Sprache: ${lang.name}`,
                    text: string,
                    buttons: [{
                        text: 'Speichern',
                        buttonType: 1
                    }, {
                        text: 'Abbrechen',
                        buttonType: -1
                    }]
                })
                    .then((result) => {
                        this.changeStringResult(result, lang);
                    });
            }
        } else {
            chayns.dialog.alert(stringName, 'Der TextString existiert nicht.');
        }
    }

    changeStringResult(data, lang) {
        const { stringName, useDangerouslySetInnerHTML } = this.props;
        if (data.buttonType === 1 && (data.text || data.value)) {
            TextString.changeTextString(stringName, useDangerouslySetInnerHTML ? data.value : data.text, lang.value)
                .then((result) => {
                    if (result.ResultCode === 0) {
                        chayns.dialog.alert('', 'Die Änderungen wurden erfolgreich gespeichert. Es kann bis zu 5 Minuten dauern, bis die Änderung sichtbar wird.');
                    } else {
                        chayns.dialog.alert('', 'Es ist ein Fehler aufgetreten.');
                    }
                })
                .catch(() => {
                    chayns.dialog.alert('', 'Es ist ein Fehler aufgetreten.');
                });
        }
    }

    render() {
        const { textString, textStringProps } = this.state;
        const {
            children, useDangerouslySetInnerHTML, language, preventNoTranslate
        } = this.props;

        const childrenProps = {
            ...{
                onClick: (e) => {
                    if (children.props.onClick && !e.ctrlKey) {
                        children.props.onClick(e);
                    }
                    this.childrenOnClick(e);
                }
            },
            ...(
                useDangerouslySetInnerHTML
                    ? { dangerouslySetInnerHTML: { __html: textString } }
                    : null
            ),
            ...textStringProps,
            ...(!preventNoTranslate && (!language || language === TextString.language) ? { className: classNames('no-translate', children.props.className) } : null),
        };

        if (textString) {
            return React.cloneElement(
                children,
                childrenProps,
                useDangerouslySetInnerHTML ? null : textString
            );
        }
        return React.cloneElement(
            children,
            childrenProps
        );
    }
}
