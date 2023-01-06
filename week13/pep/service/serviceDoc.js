
import "../domainDoc.js"

/**
 * @callback onDevelopersReadyCallback
 * @param    {Developer[]} devs - array of developers
 * @return   {undefined} void
 */


/**
 * Common interface for all services (abstract factory pattern)
 *
 * @typedef   PepService
 * @property { (onDevelopersReadyCallback) => void} loadDevelopers - load the developers and call the callback with them
 * @property { (onProjectsReadyCallback)   => void} loadProjects   - load the projects and call the callback with them
 * @property { (ListenerCallback) => Listener } onDevAdded
 * @property { (ListenerCallback) => Listener } onProjAdded
 *
 * */
