import * as RC from 'ArgoDG/src/rc.js';

export function midmid(A, B) {
    return RC.midpoint(A, RC.midpoint(A, B));
}
