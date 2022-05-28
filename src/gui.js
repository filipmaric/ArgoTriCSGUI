import * as DG from 'ArgoDG/src/dg/dg.js';
import * as RC from 'ArgoDG/src/dg/rc.js';
import { Construction } from 'ArgoDG/src/dg/construction.js';
import { ConstructionToolbar, ToolDragFree } from 'ArgoDG/src/dg/tool.js';
import { AnimationButtons } from 'ArgoDG/src/dg/animation_buttons.js';

import { fetchJSON } from './json.js';
import { Solution } from './solution.js';
import { Hints } from './hints.js';

function setup(solutionJSON) {
    DG.setup("mycanvas", { width: 500, height: 500, border: "1px solid #ccc"}, 0, 150, 0, 150);
    // use global view
    const view = DG.view();

    // load solution from JSON
    const solution = new Solution(solutionJSON);
    // show construction to the global view (but do not interact with them)
    const construction = solution.construction();
    construction.addView(view);

    // objects that user has constructed and enable interaction with it
    const userConstruction = new Construction();    
    userConstruction.addView(view);
    
    // initialize by initially given objects in the solution
    const givenObjects = solution.givenObjects().map(name => solution.object(name));

    givenObjects.forEach(obj => {
        userConstruction.addObject(obj);
    });

    // make tools that user can use to create his construction
    view.setTool(new ToolDragFree(view, userConstruction));
    
    const toolbar = new ConstructionToolbar(userConstruction, DG.view(),
                                            DG.container(),
                                            constructionCallback);
    // all three triangle vertices
    const allVertices = solution.allVertices().sort().map(name => solution.object(name));
    
    // construct all triangle elements
    const allTriangleElements = RC.triangle(...allVertices);

    // hide all constructed elements (show only elements that are initially given)
    solution.hideConstructed();

    function constructionCallback(obj) {
        userConstruction.addObject(obj);
        
        function check(knownObject) {
            if (obj.eq(knownObject)) {
                const name = knownObject.label();
                obj.label(name);
                obj.color(knownObject.color() ? knownObject.color() : "green");
                if (removeHints)
                    hints.remove(name);
            }
        }

        let removeHints = true;
        solution.forEach(check);
        removeHints = false;
        allTriangleElements.forEach(check);
    }
    
    // Hints
    const hints = new Hints(solution, userConstruction, view, document.getElementById("hints"));
    hints.show();
}

function animate(solutionJSON) {
    DG.setup("mycanvas", { width: 500, height: 500, border: "1px solid #ccc"}, 0, 150, 0, 150);

    // load solution from JSON
    const solution = new Solution(solutionJSON);

    const construction = solution.construction();

    // attach construction to the global view
    DG.setConstruction(construction);

    const vertices = solution.allVertices().map(name => solution.object(name));
    for (let i = 0; i < vertices.length; i++)
        DG.segment(vertices[i], vertices[(i+1) % vertices.length]).width(3);

    var animButtons = new AnimationButtons(construction, DG.container());
}

export { setup, animate };
