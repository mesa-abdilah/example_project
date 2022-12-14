package com.anz.markets.luxor.sample.query;

import com.anz.markets.luxor.client.LuxorClientFactory;
import com.anz.markets.luxor.sample.SomeClientSpringBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueryClientSpringConfiguration {
	
	@Bean
	public LuxorClientFactory luxorClient() throws Exception {
		return new LuxorClientFactory("classpath:query/query-client-config.properties");
   	}

	@Bean
	public SomeClientSpringBean someClientSpringBean(){
		return new SomeClientSpringBean();
	}

}
