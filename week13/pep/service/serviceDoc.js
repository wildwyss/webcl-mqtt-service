import "../domainDoc.js"

/**
 * @callback onDevelopersReadyCallback
 * @param    { Developer[] } devs - array of developers
 * @return   { void } void
 */

/**
 * Common interface for all services (abstract factory pattern)
 *
 * @typedef   PepService2
 * @property { (onDevelopersReadyCallback) => void } loadDevelopers - load the developers and call the callback with them
 * @property { (onProjectsReadyCallback)   => void } loadProjects   - load the projects and call the callback with them
 * @property { (ListenerCallback) => Listener }      onDevAdded     - registers a listener under a given Topic
 * @property { (ListenerCallback) => Listener }      onProjAdded    - registers a listener under a given Topic
 */