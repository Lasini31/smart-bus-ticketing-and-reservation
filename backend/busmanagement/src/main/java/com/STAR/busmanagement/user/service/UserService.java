package com.STAR.busmanagement.user.service;

import com.STAR.busmanagement.user.dto.UpdateProfileRequest;
import com.STAR.busmanagement.user.model.User;
import com.STAR.busmanagement.user.repository.UserRepository;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserProfile(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserProfile(UUID id, UpdateProfileRequest request) {
        User existingUser = getUserProfile(id);
        
        // Safely alter only the allowed request parameter inputs
        existingUser.setName(request.getName());
        existingUser.setContactNumber(request.getContactNumber());
        
        return userRepository.save(existingUser);
    }

    public void deleteUser(UUID id) {
        User existingUser = getUserProfile(id);
        userRepository.delete(existingUser);
    }
}