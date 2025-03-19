import {add} from './module.js?foo=bar';
import { sub } from './submodule.js';

console.log(add(1,2));
console.log(sub(1,2));