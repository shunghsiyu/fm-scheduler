# Scheduler

Run test and show full stacktrace on exception

    mvn -Dsurefire.useFile=false -DtrimStackTrace=false clean test

Create single jar for distribution

    mvn clean compile assembly:single

Run Main

    mvn exec:java -Dexec.mainClass="com.baeldung.optaplanner.Main"

# Relevant articles

- [A Guide to OptaPlanner](https://www.baeldung.com/opta-planner)
