package com.anz.markets.luxor.sample.subscription;

import com.anz.markets.luxor.client.LuxorClient;
import com.anz.markets.luxor.client.api.model.ClientTrade;
import com.anz.markets.luxor.client.api.services.ClientQueryService;
import com.anz.markets.luxor.client.api.services.ClientTradeDataService;
import com.anz.markets.luxor.client.api.services.subscription.ClientSubscription;
import com.anz.markets.luxor.client.api.services.subscription.ClientSubscriptionEventListener;
import com.anz.markets.luxor.client.service.subscription.SubscriptionProcessor;
import com.anz.markets.luxor.client.service.subscription.SubscriptionService;
import com.anz.markets.luxor.commons.ApplicationContextProvider;
import com.anz.markets.luxor.commons.LuxorConfiguration;
import com.anz.markets.luxor.commons.utils.VMShutdownHook;
import com.anz.markets.luxor.domain.client.criteria.Restrictions;
import com.anz.markets.luxor.domain.client.criteria.impl.CriteriaImpl;
import com.anz.markets.luxor.domain.criteria.common.Criteria;
import com.anz.markets.luxor.sample.ClientApplicationManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

import java.io.IOException;
import java.util.Arrays;

@SpringBootApplication
@ImportResource("classpath:subscription/subscription-client-context-embedded.xml")
public class TestSubscriptionClient {

    private static final Logger logger = LogManager.getLogger(TestSubscriptionClient.class);
    public static final String CONTEXT_FILE_LOCATION = "classpath:subscription/subscription-client-context-embedded.xml";
    public static final String CONFIG_FILE_LOCATION = "classpath:subscription/subscription-client-config.properties";

    public static void main(String[] args) throws Exception {
        testClient(System.getProperty("luxor.client.sample.bootType", "SPRING-XML"));
//        testClient(System.getProperty("luxor.client.sample.bootType", "SPRING-BOOT"));
    }

    public static void testClient(String bootType) throws Exception {

        logger.info("Client initializing ..");

        final ClientApplicationManager clientApplicationManager = new ClientApplicationManager();

        final LuxorClient luxorClient;
        switch (bootType){
            case "SPRING-XML":
                luxorClient = clientApplicationManager.buildLuxorClientWithSpringXML(CONTEXT_FILE_LOCATION);
                break;
            case "SPRING-BOOT":
                luxorClient = clientApplicationManager.buildLuxorClientWithSpringBoot(TestSubscriptionClient.class);
                break;
            default:
                luxorClient = clientApplicationManager.buildLuxorClientWithoutSpring(CONFIG_FILE_LOCATION);
        }

        logger.info("Client started ..");

        logger.info("ClientQueryService == " + luxorClient.getClientQueryService());

        testSubscription(luxorClient, 1);

        new VMShutdownHook().hookUp();
        logger.info("Client exiting ..");
    }

    public static void testSubscription(LuxorClient luxorClient, int index) throws IOException {

        ClientTradeDataService tradeService = luxorClient.getClientQueryService().getClientTradeDataService();
//        ClientTradeDataService tradeService = luxorClient.getClientQueryService().getClientTradeDataService();

        Criteria criteria = tradeService.newCriteria();
//        Criteria criteria = new CriteriaImpl("MarketData");
        criteria.add(Restrictions.equal("sourceSystem", "MUREX"));
        criteria.add(Restrictions.in("tradeId", Arrays.asList(new String[]{"3426247", "12828781", "12851592"})));

        final String subscriptionName = LuxorConfiguration.CLIENT_TYPE_ID.getCurrentValue() + "_#_" + index;
        final ClientSubscription<ClientTrade> clientSubscription = tradeService.newSubscription(subscriptionName, criteria, true);

        final ClientSubscriptionEventListener<ClientTrade> eventListener = new LuxorSubscriptionProcessor();
        clientSubscription.registerListener(eventListener);

        clientSubscription.register();
        //registration of subscription will Callback Processor
        //This needs to be invoke ONLY when the final subscription has been registered
        clientSubscription.start();

        // anandv4: Uncomment below to avoid VM exit. Below should execute after all of the application code.
//        new VMShutdownHook().hookUp();
    }
}








