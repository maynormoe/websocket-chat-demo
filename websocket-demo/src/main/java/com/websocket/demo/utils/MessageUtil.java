package com.websocket.demo.utils;

import com.websocket.demo.domain.MessageResult;

/**
 * @author mayno
 */
public class MessageUtil {
    public static MessageResult getMessageResult(boolean isSystem, String from, String content, String time) {
        return MessageResult.builder()
                .isSystem(isSystem)
                .from(from)
                .content(content)
                .time(time)
                .build();
    }
}
