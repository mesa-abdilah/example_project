package com.anz.markets.luxor.sample;

import com.anz.markets.luxor.client.LuxorClient;
import com.anz.markets.luxor.client.api.services.ClientTradeDataService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PostConstruct;

/**
 * Created by anandv4 on 15/07/2015.
 */
public class SomeClientSpringBean {

    private static final Logger logger = LogManager.getLogger(SomeClientSpringBean.class);

    @Autowired
    private LuxorClient luxorClient;

    private ClientTradeDataService clientTradeDataService;

    @PostConstruct
    public void init() {

        clientTradeDataService = luxorClient.getClientQueryService().getClientTradeDataService();

        logger.info("SomeClientSpringBean's clientTradeDataService = " + clientTradeDataService);
    }

    public ClientTradeDataService getClientTradeDataService() {
        return clientTradeDataService;
    }
}
