
import { getDomain } from '../../lib';

export function normalizeChildProps(component, props, origin) {

    let result = {};

    for (let key of Object.keys(props)) {

        let prop = component.props[key];
        let value = props[key];

        if (component.looseProps && !prop) {
            result[key] = value;
            continue;
        }

        if (typeof prop.childDef === 'function') {
            if (!value) {
                if (prop.getter) {
                    value = function() {
                        return Promise.resolve(prop.childDef.call());
                    };
                } else {
                    value = prop.childDef.call();
                }
            } else if (prop.getter) {
                let val = value;
                value = function() {
                    return val.apply(this, arguments).then(res => {
                        return res ? res : prop.childDef.call();
                    });
                };
            }
        }

        if (value && prop.sameDomain && origin !== getDomain(window)) {
            value = null;
        }

        result[key] = value;

        if (prop.alias && !result[prop.alias]) {
            result[prop.alias] = value;
        }
    }

    return result;
}


