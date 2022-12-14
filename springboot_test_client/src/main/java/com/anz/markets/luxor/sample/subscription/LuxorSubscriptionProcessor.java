package com.anz.markets.luxor.sample.subscription;

import com.anz.markets.luxor.client.api.model.ClientTrade;
import com.anz.markets.luxor.client.api.services.subscription.ClientSubscriptionEventListener;
import com.anz.markets.luxor.client.service.subscription.BaseSubscriptionProcessor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class LuxorSubscriptionProcessor implements ClientSubscriptionEventListener<ClientTrade> {

    private static Logger logger = LogManager.getLogger(LuxorSubscriptionProcessor.class);

    @Override
    public void processInitial(ClientTrade object) {
        logger.info("processInitial: " + object.getIdentifier());
    }

    @Override
    public void processCreate(ClientTrade object) {
        logger.info("processCreate: " + object);
    }

    @Override
    public void processUpdate(ClientTrade object) {
        logger.info("processUpdate: " + object);
    }

    @Override
    public void processDelete(ClientTrade object) {
        logger.info("processDelete: " + object);
    }

}


