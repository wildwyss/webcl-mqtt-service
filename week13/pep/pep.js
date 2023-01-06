import {dom} from "../util/dom.js"
import {registerForMouseDrag} from "./mouseDrag.js";

import {PepController} from "./pepController.js";

import {WeekController} from "./week/weekController.js";
import {weekProjector} from "./week/weekProjector.js";

import {AvailabilityController} from "./availability/availabilityController.js";
import {availabilityProjector} from "./availability/availabilityProjector.js";

import {OccupationController} from "./assignment/occupationController.js";
import {occupationProjector} from "./assignment/occupationProjector.js";

import {StaffingController} from "./assignment/staffingController.js";
import {staffingProjector} from "./assignment/staffingProjector.js";

import {DeveloperController} from "./developer/devController.js"
import {developerProjector} from "./developer/devProjector.js";

import {ProjectController} from "./project/projectController.js"
import {projectProjector} from "./project/projectProjector.js"

import {NeedController} from "./need/needController.js";
import {needProjector} from "./need/needProjector.js";
import {toDeveloper, toProject} from "./service/jsonToModel.js";
import {imagePath} from "./pepMqttStarter.js";

export { start } ;

const start = (appRootId, devArray, projectsArray, pepService) => {

    const pepController = PepController();

    const weekController = WeekController(); // static structural information is set up eagerly
    pepController.weeks.forEach( weekData => weekController.addWeek(weekData) );

    const developerController       = DeveloperController();
    const projectController         = ProjectController();

    const availabilityController    = AvailabilityController();
    const assignmentController      = OccupationController(projectController);

    const needController            = NeedController();
    const staffingController        = StaffingController(developerController);

    const newAssignmentCommand = assignment => {
        assignmentController.addAssignment(assignment); // we add both but qualifiers keep them in sync
        staffingController.addAssignment(assignment);
    };

    const render = () => {

        // todo: think about resetting the model world on a possible re-render

        const root = dom(`<div id="${appRootId}">`);

        // render header of week names and setting up the "columns"s
        weekProjector(weekController, root);

        // register add/remove listeners for the various presentation model types in the developer topic
        developerProjector(developerController, weekController, assignmentController, root);
        availabilityProjector(availabilityController, root);
        occupationProjector(assignmentController, root);

        projectProjector(projectController, weekController, staffingController, newAssignmentCommand, root);
        needProjector(needController, root);
        staffingProjector(staffingController, root);

        devArray.forEach( developer             => {
            developerController.addDeveloper(developer);
            const avail = pepController.avails(developer.id);
            avail.forEach(availabilityController.addAvailability);
        });

        projectsArray.forEach( project          =>{
            projectController.addProject(project);
            const needs = pepController.need(project.id);
            needs.forEach(needController.addNeed);
        });

        pepController.assignments.forEach( newAssignmentCommand );

        pepService.onProjAdded(projects => {
            const json = JSON.parse(projects);
            json.forEach(jsonProject => {
                const proj = toProject(jsonProject);
                projectController.addProject(proj);
                const needs = pepController.need(proj.id);
                needs.forEach(needController.addNeed);
            });
        });

        pepService.onDevAdded(devs => {
            const json = JSON.parse(devs);
            json.forEach(jsonDev => {
                const dev = toDeveloper(imagePath)(jsonDev, jsonDev.id);
                const avail = pepController.avails(dev.id);
                developerController.addDeveloper(dev);
                avail.forEach(availabilityController.addAvailability);
            });
        });
        const topicsOverWeeks = document.getElementById(appRootId);
        topicsOverWeeks.replaceWith(root);
    };

    registerForMouseDrag( () => undefined );

    render();
};

