package com.baeldung.optaplanner;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.core.config.Configurator;
import org.apache.logging.log4j.core.config.DefaultConfiguration;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Main {
    public static void main(String[] args) throws Exception {
        Configurator.initialize(new DefaultConfiguration());
        Configurator.setRootLevel(Level.INFO);
        Server server = new Server();
        ServerConnector connector = new ServerConnector(server);
        connector.setPort(8080);
        server.setConnectors(new Connector[]{connector});

        ServletContextHandler context = new ServletContextHandler(
                ServletContextHandler.NO_SESSIONS);
        context.setContextPath("/");
        String resourcePath = Main.class.getResource("/webapp").toString();
        context.setResourceBase(resourcePath);
        server.setHandler(context);

        ServletHolder defaultHolder = new ServletHolder("default", DefaultServlet.class);
        defaultHolder.setInitParameter("dirAllowed", "false");
        context.addServlet(defaultHolder, "/");

        ServletHolder schedulerHolder = new ServletHolder("scheduler", SchedulerServlet.class);
        context.addServlet(schedulerHolder, "/schedules");

        server.start();
        server.join();
    }

    public static class SchedulerServlet extends HttpServlet {
        @Override
        public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
            ObjectMapper mapper = new ObjectMapper();
            SchedulePlan plan = mapper.readValue(req.getInputStream(), SchedulePlan.class);
            SolverFactory<SchedulePlan> solverFactory =
                    SolverFactory.createFromXmlResource("schedulePlanSolverConfigDrools.xml");
            Solver<SchedulePlan> solver = solverFactory.buildSolver();
            plan = solver.solve(plan);
            resp.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_OK);
            ExcelWriter.output(plan, resp.getOutputStream());
        }
    }
}
