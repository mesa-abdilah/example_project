package com.anz.markets.luxor.sample;

import com.anz.markets.luxor.client.ClientConfigurationException;
import com.anz.markets.luxor.client.LuxorClient;
import com.anz.markets.luxor.client.LuxorClientFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created by anandv4 on 30/07/2015.
 */
public class ClientApplicationManager {

    public LuxorClient buildLuxorClientWithoutSpring(String configFileLocation) {
        try {
            final LuxorClient luxorClient = new LuxorClientFactory(configFileLocation).newLuxorClient();
            luxorClient.start();
            return luxorClient;
        } catch (ClientConfigurationException e) {
            // Handle the exception
            throw new IllegalArgumentException(e);
        }
    }

    public LuxorClient buildLuxorClientWithSpringXML(String contextFileLocation) {
        final ApplicationContext applicationContext = new ClassPathXmlApplicationContext(contextFileLocation);
        return applicationContext.getBean(LuxorClient.class);
    }

    public LuxorClient buildLuxorClientWithSpringBoot(Class bootClazz) {
        final ApplicationContext applicationContext = SpringApplication.run(bootClazz, new String[]{});
        return applicationContext.getBean(LuxorClient.class);
    }
}