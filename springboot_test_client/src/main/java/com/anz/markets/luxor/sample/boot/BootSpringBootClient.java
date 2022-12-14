package com.anz.markets.luxor.sample.boot;

import com.anz.markets.luxor.client.LuxorClient;
import com.anz.markets.luxor.client.LuxorClientFactory;
import com.anz.markets.luxor.sample.SomeClientSpringBean;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

/**
 * Created by anandv4 on 30/07/2015.
 */
@SpringBootApplication
//@Import(ClientApplicationSpringConfiguration.class)
//@ImportResource("classpath:query/query-client-context-embedded.xml")
public class BootSpringBootClient {

    private static final Logger logger = LogManager.getLogger(BootSpringBootClient.class);

    public static void main(String[] args) throws Exception {

        logger.info("Client initializing ..");
        final ApplicationContext applicationContext = SpringApplication.run(BootSpringBootClient.class, new String[]{});

        final LuxorClient luxorClient = applicationContext.getBean(LuxorClient.class);

        logger.info("Client started ..");

        logger.info("luxorClient == " + luxorClient);

        logger.info("ClientQueryService == " + luxorClient.getClientQueryService());

        final SomeClientSpringBean clientSpringBean = applicationContext.getBean(SomeClientSpringBean.class);

        logger.info("clientSpringBean == " + clientSpringBean);

        logger.info("Client exiting ..");

    }

    @Bean
    public LuxorClientFactory luxorClient() throws Exception {
        return new LuxorClientFactory("classpath:query/query-client-config.properties");
    }

    @Bean
    public SomeClientSpringBean someClientSpringBean(){
        return new SomeClientSpringBean();
    }
}
