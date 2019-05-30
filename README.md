# Scheduler

Run test and show full stacktrace on exception

    mvn -Dsurefire.useFile=false -DtrimStackTrace=false clean test

Create single jar for distribution

    mvn clean compile assembly:single

Run Main (for development add `-DallowCrossOrigin`)

    mvn exec:java -Dexec.cleanupDaemonThreads=false -Dexec.mainClass="com.baeldung.optaplanner.Main"

# Relevant articles

- [A Guide to OptaPlanner](https://www.baeldung.com/opta-planner)
- [Optaplanner 7.13.0 cant be executed from a jar file](https://stackoverflow.com/questions/53199223/optaplanner-7-13-0-cant-be-executed-from-a-jar-file)
