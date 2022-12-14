package com.anz.markets.luxor.sample.query;

import com.anz.markets.luxor.client.LuxorClient;
import com.anz.markets.luxor.client.api.model.ClientParty;
import com.anz.markets.luxor.client.api.model.ClientTrade;
import com.anz.markets.luxor.client.api.services.ClientPartyDataService;
import com.anz.markets.luxor.client.api.services.ClientTradeDataService;
import com.anz.markets.luxor.client.service.FunctionExecution;
import com.anz.markets.luxor.client.service.FunctionExecutor;
import com.anz.markets.luxor.commons.ApplicationContextProvider;
import com.anz.markets.luxor.commons.MessageUtil;
import com.anz.markets.luxor.domain.GenericMessage;
import com.anz.markets.luxor.domain.WrappedEnterpriseDataImpl;
import com.anz.markets.luxor.domain.client.criteria.Restrictions;
import com.anz.markets.luxor.domain.criteria.common.Criteria;
import com.anz.markets.luxor.sample.ClientApplicationManager;
import com.gemstone.gemfire.cache.Region;
import com.gemstone.gemfire.cache.client.ClientCacheFactory;
import com.gemstone.gemfire.cache.util.ObjectSizer;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

@SpringBootApplication
//@Import(ClientApplicationSpringConfiguration.class)
@ImportResource("classpath:query/query-client-context-embedded.xml")
public class TestQueryClient {

    private static final Logger logger = LogManager.getLogger(TestQueryClient.class);

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
                luxorClient = clientApplicationManager.buildLuxorClientWithSpringXML("classpath:query/query-client-context-embedded.xml");
                break;
            case "SPRING-BOOT":
                luxorClient = clientApplicationManager.buildLuxorClientWithSpringBoot(TestQueryClient.class);
                break;
            default:
                luxorClient = clientApplicationManager.buildLuxorClientWithoutSpring("classpath:query/query-client-config.properties");
        }

        logger.info("Client started ..");

        logger.info("luxorClient == " + luxorClient);

        logger.info("ClientQueryService == " + luxorClient.getClientQueryService());

//        testQuery(luxorClient);
//        submitMessage(luxorClient);
//        getLuxorData(luxorClient);
//        getTradeDataWithDate(luxorClient);

        getLuxorTestData(luxorClient);

        logger.info("Client exiting ..");

    }

    private static void submitMessage(LuxorClient luxorClient) throws Exception {
        FunctionExecutor functionExecutor = (FunctionExecutor) ApplicationContextProvider.getBean("functionExecutor");
        functionExecutor.execute("com.anz.markets.luxor.server.function.GenericExecutionFunction", new
                FunctionExecution().withArgs(createWrappedEnterpriseData("C:\\workspaces\\luxorWS\\branches\\trunk_integration_luxor_3_gemfire_8\\luxor\\luxor-test-data\\src\\test\\resources\\DataDrivenSystemTests\\trade_actions\\single_trade\\insertion\\queryableFields-murex-2_11\\actions\\1.IRSwithNewfields.xml")));
    }

    public static void getTradeDataWithDate(LuxorClient luxorClient) {
        ClientTradeDataService service = luxorClient.getClientQueryService().getClientTradeDataService();
        Criteria criteria = service.newCriteria();
        criteria.add(Restrictions.equal(Restrictions.SRC_SYSTEM, "MUREX"));
        Date date = new Date(1348581600000L);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZ");
        String isoDateOut = dateFormat.format(date);

        Collection<ClientTrade> clientTrades = service.getDeadTradesWithFutureCashflows(isoDateOut, criteria);

        for(ClientTrade clientTrade : clientTrades) {
            System.out.println(clientTrade.getTradeId());
        }
    }



    private static void testQuery(LuxorClient luxorClient) throws IOException {

        ClientTradeDataService tradeService = luxorClient.getClientQueryService().getClientTradeDataService();

        Criteria criteria = tradeService.newCriteria();
        criteria.add(Restrictions.equal("sourceSystem", "MUREX"));
        criteria.add(Restrictions.in("tradeId", Arrays.asList(new String[]{"10156778", "11044395"})));
        Collection<ClientTrade> result = tradeService.getActiveTrades(criteria);

        logger.debug("RESULT-SET SIZE: " + result.size());
        for (ClientTrade clientTrade : result) {
            Object model = clientTrade.getQueryableFields().get(LuxorConstants.MODEL);
            String jsonString = null;
            if (model instanceof byte[]) {
                try {
                    model = MessageUtil.getInstance().extractBytes((byte[]) model);
                    jsonString = new String((byte[])model);
                } catch (DataFormatException e) {
                    e.printStackTrace();
                }
            }
            logger.info(clientTrade.getModel());
            logger.debug(clientTrade.getLeg1NotionalAmount());
            break;
        }
    }

    private static void getLuxorData(LuxorClient luxorClient) {
        final Logger dataLogger = LogManager.getLogger("luxor_data");

        ClientPartyDataService service = luxorClient.getClientQueryService().getClientPartyDataService();

        Collection<ClientParty> result = service.getActiveParties(service.newCriteria());

        logger.debug("RESULT-SET SIZE: " + result.size());
        for (ClientParty data : result) {
            dataLogger.info(data.getPartyName() + "|" + data.getIdentifier());
        }
    }

    private static GenericMessage createWrappedEnterpriseData(String fileName) throws IOException {
        WrappedEnterpriseDataImpl wrappedEnterpriseData = new WrappedEnterpriseDataImpl("MUREX", "tradedata", "1-1",
                "0.06",null,fileName);
        FileInputStream fileInputStream = new FileInputStream(new File(fileName));
        wrappedEnterpriseData.setPayLoad(MessageUtil.getInstance().compressBytes(
                IOUtils.toByteArray(fileInputStream)));
        return new GenericMessage("save",wrappedEnterpriseData);
    }

    private static void getLuxorTestData(LuxorClient luxorClient) {

        Region<Object, Object> tradeMessage = ClientCacheFactory.getAnyInstance().getRegion("TradeMessage");
        System.out.println();
        for(Map.Entry<Object, Object> entry : tradeMessage.getAll(tradeMessage.keySetOnServer()).entrySet()) {
            System.out.print("key size = " + ObjectSizer.REFLECTION_SIZE.sizeof(entry.getKey()));
            System.out.print(", value size = " + ObjectSizer.REFLECTION_SIZE.sizeof(entry.getValue()));
        }


        Region<Object, Object> payload = ClientCacheFactory.getAnyInstance().getRegion("Payload");
        System.out.println();
        for(Map.Entry<Object, Object> entry : payload.getAll(payload.keySetOnServer()).entrySet()) {
            System.out.print("key size = " + ObjectSizer.REFLECTION_SIZE.sizeof(entry.getKey()));
            System.out.print(", value size = " + ObjectSizer.REFLECTION_SIZE.sizeof(entry.getValue()));
        }


        ClientTradeDataService service = luxorClient.getClientQueryService().getClientTradeDataService();

        Collection<ClientTrade> result = service.getActiveTrades(service.newCriteria());

        logger.debug("RESULT-SET SIZE: " + result.size());
    }

}

