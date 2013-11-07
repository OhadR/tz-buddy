package com.ohadr.utils;

import java.io.ByteArrayOutputStream;

import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.codehaus.jackson.map.ObjectMapper;

/**
 * Created by IntelliJ IDEA.
 * User: oredlich
 * Date: 11/24/11
 * Time: 3:06 PM
 * To change this template use File | Settings | File Templates.
 */
public class Utils
{
//    private static final Logger log = Logger.getLogger(Utils.class);

    public static <T> String convertToJson(T objectToConvert)
    {
        ObjectMapper mapper = new ObjectMapper();
        ByteArrayOutputStream bis = new ByteArrayOutputStream();

        String json = null;
        try
        {
            mapper.writeValue(bis, objectToConvert);
            json = bis.toString();
        }
        catch (Exception e)
        {
            e.printStackTrace();
//            log.error("error converting " + objectToConvert.getClass().getSimpleName() + " to JSON");
        }

        return json;
    }


    public static <T> T convertFromJson(String objectToConvert, Class<T> valueType)
    {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        ACCEPT_EMPTY_STRING_AS_NULL_OBJECT(false)

        T retVal = null;
        try
        {
            retVal = mapper.readValue(objectToConvert, valueType);
        }
        catch (Exception e)
        {
            e.printStackTrace();
//            log.error("error converting " + objectToConvert.getClass().getSimpleName() + " to JSON");
        }

        return retVal;
    }
}
