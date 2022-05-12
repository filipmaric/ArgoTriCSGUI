import * as DG from 'ArgoDG/src/dg/dg.js';
import * as RC from 'ArgoDG/src/dg/rc.js';
import { Construction } from 'ArgoDG/src/dg/construction.js';
import { ConstructionToolbar } from 'ArgoDG/src/dg/tool.js';
import { AnimationButtons } from 'ArgoDG/src/dg/animation_buttons.js';

import { fetchJSON } from './json.js';
import { Solution } from './solution.js';
import { Hints } from './hints.js';

function setup(solutionJSON) {
    DG.setup("mycanvas", { width: 500, height: 500, border: "1px solid #ccc"}, 0, 150, 0, 150);
    
    // load solution from JSON
    const solution = new Solution(solutionJSON);
    // all three triangle vertices
    const allVertices = solution.allVertices().sort().map(name => solution.object(name));
    // construct all triangle elements
    const allTriangleElements = RC.triangle(...allVertices);
    // hide all constructed elements (show only elements that are initially given)
    solution.hideConstructed();
    
    // objects that user has constructed
    const userConstruction = new Construction();
    // initialize by initially given objects in the solution
    solution.givenObjects().map(name => solution.object(name)).forEach(obj => {userConstruction.addObject(obj); });
    
    function constructionCallback(obj) {
        userConstruction.addObject(obj);
        
        function check(knownObject) {
            if (obj.eq(knownObject)) {
                const name = knownObject.label();
                obj.label(name);
                obj.color(knownObject.color() ? knownObject.color() : "green");
                hints.remove(name);
            }
        }

        solution.forEach(check);
        allTriangleElements.forEach(check);
    }
    // make tools that user can use to create his construction
    const toolbar = new ConstructionToolbar(userConstruction, DG.view(),
                                            DG.view().canvas().container(),
                                            constructionCallback);
    
    // Hints
    const hints = new Hints(solution, userConstruction, document.getElementById("hints"));
    hints.show();
}

function animate(solutionJSON) {
    DG.setup("mycanvas", { width: 500, height: 500, border: "1px solid #ccc"}, 0, 150, 0, 150);

    // load solution from JSON
    const solution = new Solution(solutionJSON);
    
    const construction = solution.construction();
    construction.addView(DG.view());

    var animButtons = new AnimationButtons(construction, DG.view().canvas().container());
}

export { setup, animate };
