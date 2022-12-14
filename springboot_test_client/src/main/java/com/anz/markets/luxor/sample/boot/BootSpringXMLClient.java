package com.anz.markets.luxor.sample.boot;

import com.anz.markets.luxor.client.LuxorClient;
import com.anz.markets.luxor.sample.SomeClientSpringBean;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created by anandv4 on 30/07/2015.
 */
public class BootSpringXMLClient {

    private static final Logger logger = LogManager.getLogger(BootSpringXMLClient.class);

    public static void main(String[] args) throws Exception {

        logger.info("Client initializing ..");

        final ApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:query/query-client-context-embedded.xml");

        final LuxorClient luxorClient = applicationContext.getBean(LuxorClient.class);

        logger.info("Client started ..");

        logger.info("luxorClient == " + luxorClient);

        logger.info("ClientQueryService == " + luxorClient.getClientQueryService());

        final SomeClientSpringBean clientSpringBean = applicationContext.getBean(SomeClientSpringBean.class);

        logger.info("clientSpringBean == " + clientSpringBean);

        logger.info("Client exiting ..");

    }
}
