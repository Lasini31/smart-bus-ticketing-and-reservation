package com.STAR.busmanagement.user.controller;

import com.STAR.busmanagement.user.dto.UpdateProfileRequest;
import com.STAR.busmanagement.user.dto.UserProfileResponse;
import com.STAR.busmanagement.user.model.User;
import com.STAR.busmanagement.user.service.UserService;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable UUID id) {
        User user = userService.getUserProfile(id);
        
        // Convert UUID to String for clean JSON representation in the DTO
        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId() != null ? user.getId().toString() : null)
                .name(user.getName())
                .contactNumber(user.getContactNumber())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @PathVariable UUID id, // <-- Changed from String to UUID
            @RequestBody UpdateProfileRequest request) {
            
        User updatedUser = userService.updateUserProfile(id, request);
        
        UserProfileResponse response = UserProfileResponse.builder()
                .id(updatedUser.getId() != null ? updatedUser.getId().toString() : null)
                .name(updatedUser.getName())
                .contactNumber(updatedUser.getContactNumber())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole())
                .build();
                
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) { // <-- Changed from String to UUID
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}