package com.fitness.fitnessapp.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendAppointmentUpdate() {
        messagingTemplate.convertAndSend("/topic/appointments", 
            new AppointmentUpdateMessage("APPOINTMENT_CREATED"));
    }
}

class AppointmentUpdateMessage {
    private String type;

    public AppointmentUpdateMessage(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
} 