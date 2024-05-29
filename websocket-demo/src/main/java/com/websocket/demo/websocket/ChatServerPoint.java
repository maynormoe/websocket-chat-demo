package com.websocket.demo.websocket;

import ch.qos.logback.core.util.StringUtil;
import com.alibaba.fastjson2.JSON;
import com.websocket.demo.domain.MessageResult;
import com.websocket.demo.domain.User;
import com.websocket.demo.utils.MessageUtil;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.Date;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author mayno
 */
@Component
@ServerEndpoint(value = "/chat/{username}")
@Slf4j
public class ChatServerPoint {

    /**
     * 存放在线用户集合
     */
    private static ConcurrentHashMap<Session, User> userMap = new ConcurrentHashMap<>();

    private Session session;

    @OnOpen
    public void onOpen(Session session, @PathParam("username") String userName, EndpointConfig endpointConfig) {
        log.info("websocket服务器建立连接成功，用户：{}, 会话id: {}", userName, session.getId());
        if (StringUtil.isNullOrEmpty(userName)) {
            log.error("连接服务器失败，请指定用户名");
        }
        // 将username存入集合
        userMap.put(session, User.builder().username(userName).build());
        // 广播给所有用户
        MessageResult messageResult = MessageUtil.getMessageResult(true, null, "欢迎：" + userName + "加入聊天室" + ", 当前在线人数：" + userMap.size(), new Date(System.currentTimeMillis()).toString());
        String result = JSON.toJSONString(messageResult);
        boardcast(result);
        this.session = session;
        String msg = "你已成功连接服务器：" + ", 当前时间：" + new Date(System.currentTimeMillis()) + ", 欢迎：" + userName + "加入聊天室" + ", 当前在线人数：" + userMap.size();
        MessageResult messageRes = MessageUtil.getMessageResult(true, null, msg, new Date(System.currentTimeMillis()).toString());
        String welcomeMsg = JSON.toJSONString(messageRes);
        this.session.getAsyncRemote().sendText(welcomeMsg);
    }

    public void boardcast(String message) {
        for (Map.Entry<Session, User> sessionUserEntry : userMap.entrySet()) {
            Session session = sessionUserEntry.getKey();
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                log.error("广播消息失败", e);
            }
        }
    }


    @OnMessage
    public void onMessage(String message) throws IOException {
        if ("bye".equalsIgnoreCase(message)) {
            // 由服务器主动关闭连接。状态码为 NORMAL_CLOSURE（正常关闭）。
            this.session.close(new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Bye"));
            return;
        }
        log.info("接收到消息：id: {}, message:{}", this.session.getId(), message);
        if (Objects.equals(message, "ping")) {
            this.session.getAsyncRemote().sendText("pong");
            return;
        }
        // 将消息广播给所有用户
        MessageResult messageResult = MessageUtil.getMessageResult(false, userMap.get(this.session).getUsername(), message, new Date(System.currentTimeMillis()).toString());
        String result = JSON.toJSONString(messageResult);
        boardcast(result);
    }

    @OnError
    public void onError(Throwable error) throws IOException {
        log.error("websocket发生错误", error);
        // 关闭连接。状态码为 UNEXPECTED_CONDITION（意料之外的异常）
        this.session.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, error.getMessage()));
    }

    @OnClose
    public void onClose(CloseReason closeReason) {
        log.info("websocket关闭连接,原因：{}", closeReason);
        if (Objects.isNull(this.session)) {
            return;
        }
        // 获取离线用户的用户名
        String userName = userMap.get(this.session).getUsername();
        userMap.remove(this.session);
        // 广播用户离线消息
        MessageResult messageResult = MessageUtil.getMessageResult(true, null, "用户：" + userName + " 已离开聊天室，当前在线人数：" + userMap.size(), new Date(System.currentTimeMillis()).toString());
        String result = JSON.toJSONString(messageResult);
        boardcast(result);
    }
}
