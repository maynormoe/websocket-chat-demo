package com.websocket.demo.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author mayno
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResult {
    private boolean isSystem;
    private String from;
    private String content;
    private String time;
}
