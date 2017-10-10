'use strict';
const recurse = require('./recurse.js').recurse;
const jptr = require('jgexml/jpath.js').jptr;

/**
* Given an expanded object and its original $ref'd form, will call
* decorator functions:
* callbacks.oldRef - allowing the old $ref to be accessed
* callbacks.circular - called on any circular objects
*/
function decorate(obj,original,callbacks) {
    recurse(obj,{},function(obj,key,state){
        if (callbacks.oldRef) {
            let equiv = jptr(original,state.path);
            if (equiv && equiv.$ref) {
                obj[key] = callbacks.oldRef(obj,key,state,equiv.$ref);
            }
        }
        if (state.circular && callbacks.circular) {
            obj[key] = callbacks.circular(obj,key,state,state.circularPath);
        }
    });
    return obj;
}

module.exports = {
    decorate : decorate
};

