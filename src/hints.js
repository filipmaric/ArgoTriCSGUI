import { laTeX2HTML } from 'ArgoDG/src/dg/latex.js';
import { Construction } from 'ArgoDG/src/dg/construction.js';

class Hints {
    constructor(solution, userConstruction, view, element) {
        this._solution = solution;
        this._user_construction = userConstruction;
        const cv = this._solution.constructedVertices();
        this._given = cv.map(name => {
            return {name: name, describe: false};
        });
        this._constructed = [...this._solution.givenObjects()];
        this._objects = new Construction();
        this._objects.setView(view);
        this._element = element;
    }

    getHints(name) {
        let hints;
        if (this._solution.step(name).construction == "W05")
            hints = this._solution.step(name).params.slice(0, 2);
        else
            hints = this._solution.step(name).params.filter(p => typeof p == 'string');

        return [...new Set(hints)];
    }

    show() {
        this.showObjects();
        this.showButtons();
    }

    showObjects() {
        this._given.forEach(hint => {
            if (!this._objects.includes(hint.name)) {
                const o = this._solution.object(hint.name).clone();
                o.color("red").opacity("0.3").dashed().show();
                this._objects.addObject(o);
            }
        });
    }

    describeHints(name) {
        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        let desc = "";
        desc += capitalize(this._solution.describeStep(name)) + ".<br>";

        const notConstructed = this.getHints(name).filter(name => !this._constructed.includes(name));
        if (notConstructed.length > 0)
            desc += "Try to construct " +
                    notConstructed.map(name => this._solution.describeObject(name)).join(" and ") + ".";
        else
            desc += "All needed objects are already constructed.";
        return desc;
    }

    showButtons() {
        this._element.innerHTML = "";

        const h3 = document.createElement("h3");
        h3.innerHTML = "Hints";
        this._element.append(h3);
        const p = document.createElement("p");
        const cv = this._solution.constructedVertices().filter(name => !this._constructed.includes(name)).map(name => laTeX2HTML(name));
        if (cv.length > 0)
            p.innerHTML = "All triangle vertices need to be constructed. You must construct " + cv.join(" and ") + ".";
        else {
            p.innerHTML = "Well done! All triangle vertices are constructed";
            this._solution.showTriangle();
        }

        const self = this;

        this._element.append(p);

        this._given.forEach((hint, i) => {
            if (!this._constructed.includes(hint.name)) {
                const p = document.createElement("p");
                this._element.append(p);

                const btn = document.createElement("button");
                btn.innerHTML = laTeX2HTML(hint.name);
                p.append(btn);

                if (hint.analogous) {
                    const p_desc = document.createElement("p");
                    p_desc.innerHTML = "This construction is completely analogous to the construction of " + laTeX2HTML(hint.analogous) + ". ";;
                    p.append(p_desc);
                    return;
                }

                if (hint.describe) {
                    const p_desc = document.createElement("p");
                    p_desc.innerHTML = this.describeHints(hint.name);
                    p.append(p_desc);
                }

                btn.addEventListener("click", function() {
                    self._given[i].describe = true;

                    const analogous = self._solution.analogous(self._given[i].name);
                    if (analogous && self._given.some(hint => hint.name == analogous && hint.describe == true && !hint.analogous)) {
                        self._given[i].analogous = analogous;
                    } else {
                        const hints = self.getHints(hint.name);
                        hints.forEach(name => {
                            if (!self._given.map(hint => hint.name).includes(name) &&
                                !self._constructed.includes(name))
                                self._given.push({name:name, describe: false});
                        });
                    }
                    self.show();
                });
            }
        });
    }

    removeDeprecated() {
        // perform a DFS of the construction tree to determine hints that are still relevant

        const relevantHints = new Set();
        // start from the vertices that need to be constructed
        const cv = this._solution.constructedVertices()
        cv.forEach(name => relevantHints.add(name));
        const stack = [...cv];
        while (stack.length > 0) {
            const name = stack.pop();
            const hints = this.getHints(name);
            hints.forEach(name => {
                if (this._given.map(hint => hint.name).includes(name) && !relevantHints.has(name)) {
                    stack.push(name);
                    relevantHints.add(name);
                }
            });
        }
        this._given = this._given.filter(hint => relevantHints.has(hint.name));
    }

    remove(name) {
        this._constructed.push(name);
        this._given = this._given.filter(hint => hint.name != name);
        this.removeDeprecated();
        this._objects.removeObject(this._objects.find(name));
        this.show();
    }
}

export { Hints };
