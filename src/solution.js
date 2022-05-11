import { laTeX2HTML } from 'ArgoDG/src/dg/latex.js';
import * as RC from 'ArgoDG/src/dg/rc.js';
import { DGObject } from 'ArgoDG/src/dg/objects.js';
import { Construction } from 'ArgoDG/src/dg/construction.js';

const W = {
    free: RC.free,
    W01: (X, Z, W, p, q) => RC.towards(Z, W, X, q, p),
    W02: RC.line,
    W03: RC.intersectLL,
    W04: RC.intersectLC,
    W05: (c, l, O, A) => RC.intersectLC_other(l, c, A),
    W05a: (c, l, O, A) => RC.intersectLC_other(l, c, A),
    W06: (X, Y) => RC.circle(Y, X),
    W07: RC.intersectCC,
    W08: RC.intersectCC_other,
    W09: RC.circle_over_segment,
    W10: RC.drop_perp,
    W10a: (A, l) => RC.drop_perp(l, A),
    W11: RC.touching_circle,
    W12: RC.tangents,
    W13: (c, A, O, t) => other_tangent(A, c, t),
    W14: RC.bisector,
    W15: RC.homothety_line,
    W16: (A, l) => RC.parallel(l, A),
    W17: RC.angle_divide,
    W19: RC.harmonic_conjugate
};

// Solution given by ArgoTriCS (parsed from JSON file)
class Solution {
    constructor(solutionJSON) {
        // dictionary mapping object names to construction steps and constructed objects
        this._solution = {}
        // ordered list of steps
        this._steps = []
        // ArgoDG construction - ordered list of objects 
        this._construction = new Construction();

        // load solution from JSON
        this.loadFromJSON(solutionJSON)
        
        // detecting analogous constructions is usefull for giving hints
        this.detectAnalogousConstructions();
    }

    // construction step for the object with the given name
    step(name) {
        return this._solution[name].step;
    }

    // constructed object with the given name
    object(name) {
        return this._solution[name].object;
    }

    // ArgoDG construction
    construction() {
        return this._construction;
    }

    // call a function on each object
    forEach(f) {
        Object.keys(this._solution).forEach(name => { f(this.object(name)); });
    }

    // load from ArgoTriCS exported JSON
    loadFromJSON(JSON) {
        JSON.forEach(step => {
            const obj = W[step.construction](...step.params.map(name => name in this._solution ? this._solution[name]["object"] : name));

            var self = this;
            function addObject(obj, name, step) {
                obj.label(name);
                if ("color" in step)
                    obj.color(step.color);
                if ("description" in step)
                    obj.description(step.description);
                // set unique name in the step
                let step_copy = {...step};
                step_copy.name = name;
                self._solution[name] = {
                    "object": obj,
                    "step": step_copy
                };
                self._steps.push(step_copy);
                self._construction.addObject(obj);
            }

            if (typeof step.name === "string")
                addObject(obj, step.name, step);
            else if (step.name.length == 1)
                addObject(obj, step.name[0], step);
            else if (step.name.length == 2) {
                addObject(obj[0], step.name[0], step);
                addObject(obj[1], step.name[1], step);
            }
        });
    }

    // names of objects that are free in the construction (initially given objects)
    givenObjects() {
        return Object.keys(this._solution).filter(name => this.step(name).construction == "free");
    }

    // names of all triangle vertices in the construction (given and constructed)
    allVertices() {
        return Object.keys(this._solution).filter(name => {
            const step = this._solution[name].step;
            return step.intriangle[0] == "vertex";
        });
    }

    // triangle vertices that have been constructed
    constructedVertices() {
        return Object.keys(this._solution).filter(name => {
            const step = this._solution[name].step;
            return step.intriangle[0] == "vertex" && step.construction != "free";
        });
    }

    // hide all constructed objects (show only objects that are initially given)
    hideConstructed() {
        this.hideAll();
        this.givenObjects().forEach(name => this._solution[name].object.show());
    }

    // show all objects (given and constructed)
    hideAll() {
        this.showAll(false);
    }
    
    // show all objects (given and constructed)
    showAll(yes) {
        this.forEach(obj => obj.show(yes));
    }

    // show the constructed triangle
    showTriangle() {
        const A = this.object('A');
        const B = this.object('B');
        const C = this.object('C');
        RC.segment(A, B).color("blue").width(2);
        RC.segment(A, C).color("blue").width(2);
        RC.segment(B, C).color("blue").width(2);
    }

    // group objects by their role in the triangle (vertices, sides, altitudes, ...)
    groupByIntriangle() {
        let groups = {};
        for (name in this._solution) {
            const step = this.step(name);
            if (step.construction == "free")
                continue;
            if ("intriangle" in step) {
                const intriangle = step.intriangle[0];
                if (intriangle in groups)
                    groups[intriangle].push(step);
                else
                    groups[intriangle] = [step];
            }
        }
        return groups;
    }

    detectAnalogousConstructions() {
        this._analogous = {};
        const groups = this.groupByIntriangle();
        for (let group in groups) {
            const objects = groups[group];
            for (let i = 1; i < objects.length; i++)
                for (let j = 0; j < i; j++) {
                    if (this.compareConstructions(objects[i].name, objects[j].name)) {
                        this._analogous[objects[i].name] = objects[j].name;
                        this._analogous[objects[j].name] = objects[i].name;
                    }
                }
        }
    }

    analogous(name) {
        return this._analogous[name];
    }

    compareConstructions(c1, c2) {
        if (typeof c1 == "number" && typeof c2 == "number")
            return parseFloat(c1) == parseFloat(c2);
        if (!c1 in this._solution || !c2 in this._solution)
            return false;
        c1 = this.step(c1);
        c2 = this.step(c2);
        if (c1.construction != c2.construction)
            return false;
        if (c1.construction == "free")
            return true;
        for (let i = 0; i < c1.params.length; i++)
            if (!this.compareConstructions(c1.params[i], c2.params[i]))
                return false;
        return true;
    }
    
    describeObject(name) {
        const step = this.step(name);
        if (!"intriangle" in step)
            return step.name;
        if (step.intriangle[0] == "circle_center_through") {
            const p = this.step(step.params[0]);
            const C = this.step(step.params[1]);
            if (p.intriangle[0] == "vertex" && C.intriangle[0] == "midpoint")
                return "circle " + laTeX2HTML(step.name) + " over segment " + C.intriangle[1][0] + C.intriangle[1][1];
        }
        let intriangle = step.intriangle[0];
        if (intriangle == "side_bis")
            intriangle = "side bisector";
        if (intriangle == "angle_bis")
            intriangle = "angle bisector";
        if (intriangle == "circle_center_through")
            intriangle = "circle";
        if (intriangle == "angle_bis_foot")
            intriangle = "foot of angle bisector";
        return intriangle + " " + laTeX2HTML(step.name);
    }

    describeStep(name) {
        const step = this.step(name);
        if (step.construction == "W01") {
            if (step.params[0] == step.params[1] && step.params[3] == 1 && step.params[4] == 2)
                return this.describeObject(name) +
                       " is the midpoint of segment between " +
                       this.describeObject(step.params[1])  +
                       " and " +
                       this.describeObject(step.params[2]);
            if (step.params[0] == step.params[1] && step.params[3] == 2 && step.params[4] == 1)
                return this.describeObject(name) +
                       " is the reflection of " +
                       this.describeObject(step.params[1])  +
                       " around " +
                       this.describeObject(step.params[2]);
            if (step.params[0] == step.params[1] && step.params[3] == -1 && step.params[4] == 1)
                return this.describeObject(name) +
                       " is the reflection of " +
                       this.describeObject(step.params[2])  +
                       " around " +
                       this.describeObject(step.params[0]);
        } else if (step.construction == "W02") {
            return this.describeObject(name) +
                   " contains " +
                   this.describeObject(step.params[0])  +
                   " and " +
                   this.describeObject(step.params[1]);
        } else if (step.construction == "W03") {
            return this.describeObject(name) +
                   " is the intersection of " +
                   this.describeObject(step.params[0])  +
                   " and " +
                   this.describeObject(step.params[1]);
        } else if (step.construction == "W05" || step.construction == "W05a") {
            return this.describeObject(name) +
                   " is the intersection of " +
                   this.describeObject(step.params[0])  +
                   " and " +
                   this.describeObject(step.params[1]);
        } else if (step.construction == "W06") {
            return this.describeObject(name) +
                   " is the circle centered at " +
                   this.describeObject(step.params[1])  +
                   " that contains " +
                   this.describeObject(step.params[0]);
        } else if (step.construction == "W10a") {
            return this.describeObject(name) +
                   " contains " +
                   this.describeObject(step.params[0]) +
                   " and is perpendicular to " +
                   this.describeObject(step.params[1]);
        } else if (step.construction == "W11") {
            return this.describeObject(name) +
                   "is the circle centered in " +
                   this.describeObject(step.params[0]) +
                   " that touches " +
                   this.describeObject(step.params[1]);
        } else if (step.construction == "W13") {
            return this.describeObject(name) +
                   " contains " +
                   this.describeObject(step.params[1]) +
                   " and is tangent to " +
                   this.describeObject(step.params[0]) +
                   " that is different from " +
                   this.describeObject(step.params[3]);
        } else if (step.construction == "W14") {
            return this.describeObject(name) +
                   "is the bisector of segment formed by " +
                   this.describeObject(step.params[0]) +
                   " and " +
                   this.describeObject(step.params[1]);
        } else if (step.construction == "W16") {
            return this.describeObject(name) +
                   " contains " +
                   this.describeObject(step.params[0]) +
                   " and is parallel to " +
                   this.describeObject(step.params[1]);
        }
        return step.construction;
    }
}

export { Solution };
