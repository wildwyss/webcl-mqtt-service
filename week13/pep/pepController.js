
export { PepController } ;


const PepController = () => {

    const weeks = [
        {id: 0, label:'Week 31'},
        {id: 1, label:'Week 32'},
        {id: 2, label:'Week 33'},
        {id: 3, label:'Week 34'},
    ];

    const avails = devId => [
        {week:0, devId:devId , avail:100},
        {week:1, devId:devId , avail:100},
        {week:2, devId:devId , avail:100},
        {week:3, devId:devId , avail:0},
    ];

    const need = projId => [
        {week:0, projId:projId, fte:  0},
        {week:1, projId:projId, fte: 50},
        {week:2, projId:projId, fte:100},
        {week:3, projId:projId, fte:  0},
    ];

    const assignments = [
        { week:0, devId:0, projId:0, amount: 70},
        { week:0, devId:0, projId:1, amount: 30},
    ];
    const projects = [];
    const devs = [];

    const addDevs = devArray => devArray.forEach( dev => devs.push(dev));

    /**
     * Any assignment with an amount of 0 will be removed from the model.
     */
    const cleanZeroAssignments = () => {
        for (let foundIdx = -1; -1 < (foundIdx = assignments.findIndex(it => it.amount <= 0));) {
            assignments.splice(foundIdx, 1);
        }
    };

    return {
        addDevs,
        cleanZeroAssignments,
        weeks, avails, projects, need, assignments, devs
    }

};
